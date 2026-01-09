package follow

import (
	"net/http"

	"connectrpc.com/connect"
	"connectrpc.com/validate"
	"github.com/food-swipe/gen/grpc/food-swipe/v1/foodswipev1connect"
	"github.com/food-swipe/internal/follow/adapters/primary/grpc"
	"github.com/food-swipe/internal/follow/adapters/secondary/storage"
	"github.com/food-swipe/internal/follow/core"
	grpcPkg "github.com/food-swipe/internal/pkg/grpc"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

func Register(mux *http.ServeMux, pool *pgxpool.Pool, logger *zap.Logger) {
	storageAdapter := storage.New(pool)
	core := core.New(storageAdapter)
	grpcAdapter := grpc.New(core)
	path, handler := foodswipev1connect.NewFollowerServiceHandler(
		grpcAdapter,
		connect.WithInterceptors(
			validate.NewInterceptor(),
			grpcPkg.NewLoggerInterceptor(logger),
		),
	)
	mux.Handle(path, handler)
}
