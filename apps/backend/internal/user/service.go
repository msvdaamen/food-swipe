package user

import (
	"net/http"

	"connectrpc.com/connect"
	"connectrpc.com/validate"
	"github.com/food-swipe/gen/grpc/food-swipe/v1/foodswipev1connect"
	grpcPkg "github.com/food-swipe/internal/pkg/grpc"
	"github.com/food-swipe/internal/user/adapters/primary/grpc"
	"github.com/food-swipe/internal/user/adapters/secondary/storage"
	"github.com/food-swipe/internal/user/core"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

func Register(mux *http.ServeMux, pool *pgxpool.Pool, logger *zap.Logger) {
	storageAdapter := storage.New(pool)
	coreInstance := core.New(storageAdapter)

	grpcAdapter := grpc.New(coreInstance)

	path, handler := foodswipev1connect.NewUserServiceHandler(
		grpcAdapter,
		connect.WithInterceptors(
			validate.NewInterceptor(),
			grpcPkg.NewLoggerInterceptor(logger),
		),
	)
	mux.Handle(path, handler)
}
