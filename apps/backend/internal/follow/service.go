package follow

import (
	"net/http"

	"connectrpc.com/connect"
	"connectrpc.com/validate"
	"github.com/food-swipe/gen/grpc/followers/v1/followersv1connect"
	"github.com/food-swipe/internal/follow/adapters/primary/grpc"
	"github.com/food-swipe/internal/follow/adapters/secondary/storage"
	"github.com/food-swipe/internal/follow/core"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Register(mux *http.ServeMux, pool *pgxpool.Pool) {
	storageAdapter := storage.New(pool)
	core := core.New(storageAdapter)
	grpcServer := grpc.New(core)
	path, handler := followersv1connect.NewFollowerServiceHandler(
		grpcServer,
		connect.WithInterceptors(validate.NewInterceptor()),
	)
	mux.Handle(path, handler)
}
