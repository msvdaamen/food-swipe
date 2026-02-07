package auth

import (
	"net/http"

	"connectrpc.com/connect"
	"github.com/food-swipe/gen/grpc/food-swipe/v1/foodswipev1connect"
	httpAdapter "github.com/food-swipe/internal/auth/adapters/primary/http"
	"github.com/food-swipe/internal/auth/adapters/secondary/providers/apple"
	"github.com/food-swipe/internal/auth/adapters/secondary/providers/google"
	"github.com/food-swipe/internal/auth/adapters/secondary/storage"
	"github.com/food-swipe/internal/auth/adapters/secondary/user"
	authConfig "github.com/food-swipe/internal/auth/config"
	"github.com/food-swipe/internal/auth/core"
	"github.com/food-swipe/internal/auth/core/models"
	"github.com/food-swipe/internal/auth/core/port"
	"github.com/food-swipe/internal/pkg/authenticator"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/labstack/echo/v5"
	"go.uber.org/zap"
)

func Register(httpServer *echo.Echo, pool *pgxpool.Pool, authenticator *authenticator.Provider, config authConfig.Config, logger *zap.Logger) *core.Core {
	storageAdapter := storage.New(pool)
	userClient := foodswipev1connect.NewUserServiceClient(
		http.DefaultClient,
		config.GrpcUrl,
		connect.WithGRPC(),
	)
	userAdapter := user.New(userClient)

	oauthProviders := make(map[models.AuthProvider]port.OAuthProvider)

	if config.GoogleClientID != "" && config.GoogleClientSecret != "" {
		googleProvider := google.New(google.Config{
			ClientID:     config.GoogleClientID,
			ClientSecret: config.GoogleClientSecret,
		})
		oauthProviders[googleProvider.GetProviderName()] = googleProvider
	}

	if config.AppleClientID != "" && config.AppleTeamID != "" && config.AppleKeyID != "" && config.ApplePrivateKey != nil {
		appleProvider := apple.New(apple.Config{
			ClientID:   config.AppleClientID,
			TeamID:     config.AppleTeamID,
			KeyID:      config.AppleKeyID,
			PrivateKey: config.ApplePrivateKey,
		})
		oauthProviders[appleProvider.GetProviderName()] = appleProvider
	}

	coreInstance := core.New(storageAdapter, oauthProviders, userAdapter, config)

	httpAdapter.New(httpServer, coreInstance, authenticator)
	return coreInstance
}
