package user

import (
	"connectrpc.com/connect"
	"connectrpc.com/validate"
	"github.com/food-swipe/gen/grpc/food-swipe/v1/foodswipev1connect"
	"github.com/food-swipe/internal/pkg/authenticator"
	grpcPkg "github.com/food-swipe/internal/pkg/grpc"
	"github.com/food-swipe/internal/user/adapters/primary/grpc"
	"github.com/food-swipe/internal/user/adapters/primary/http"
	"github.com/food-swipe/internal/user/adapters/secondary/storage"
	"github.com/food-swipe/internal/user/core"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/labstack/echo/v5"
	"go.uber.org/zap"
)

func Register(grpcServer grpcPkg.Server, httpServer *echo.Echo, pool *pgxpool.Pool, authenticator *authenticator.Provider, logger *zap.Logger) {
	storageAdapter := storage.New(pool)
	coreInstance := core.New(storageAdapter)

	grpcAdapter := grpc.New(coreInstance)
	http.New(httpServer, coreInstance, authenticator)

	path, handler := foodswipev1connect.NewUserServiceHandler(
		grpcAdapter,
		connect.WithInterceptors(
			validate.NewInterceptor(),
			grpcPkg.NewLoggerInterceptor(logger),
		),
	)
	grpcServer.Handle(path, handler)
}
