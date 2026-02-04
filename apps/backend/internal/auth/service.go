package auth

import (
	"github.com/food-swipe/internal/auth/adapters/primary/http"
	"github.com/food-swipe/internal/auth/adapters/secondary/providers/apple"
	"github.com/food-swipe/internal/auth/adapters/secondary/providers/google"
	"github.com/food-swipe/internal/auth/adapters/secondary/storage"
	authConfig "github.com/food-swipe/internal/auth/config"
	"github.com/food-swipe/internal/auth/core"
	"github.com/food-swipe/internal/auth/core/port"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/labstack/echo/v5"
)

func Register(httpServer *echo.Echo, pool *pgxpool.Pool, config authConfig.Config) (*core.Core, error) {
	// Initialize storage adapter
	storageAdapter := storage.New(pool)

	// Initialize OAuth providers
	oauthProviders := make(map[string]port.OAuthProvider)

	// Google OAuth provider
	if config.GoogleClientID != "" && config.GoogleClientSecret != "" {
		googleProvider := google.New(google.Config{
			ClientID:     config.GoogleClientID,
			ClientSecret: config.GoogleClientSecret,
		})
		oauthProviders["google"] = googleProvider
	}

	// Apple OAuth provider
	if config.AppleClientID != "" && config.AppleTeamID != "" && config.AppleKeyID != "" && config.ApplePrivateKey != nil {
		appleProvider := apple.New(apple.Config{
			ClientID:   config.AppleClientID,
			TeamID:     config.AppleTeamID,
			KeyID:      config.AppleKeyID,
			PrivateKey: config.ApplePrivateKey,
		})
		oauthProviders["apple"] = appleProvider
	}

	// Initialize core with configuration
	coreInstance := core.New(storageAdapter, oauthProviders, nil, config)

	// Initialize HTTP adapter
	http.New(httpServer, coreInstance)

	return coreInstance, nil
}
