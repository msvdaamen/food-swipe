package recipe

import (
	"net/http"

	"connectrpc.com/connect"
	"connectrpc.com/validate"
	"github.com/food-swipe/gen/grpc/food-swipe/v1/foodswipev1connect"
	"github.com/food-swipe/internal/recipe/adapter/primary/grpc"
	"github.com/food-swipe/internal/recipe/adapter/secondary/storage"
	"github.com/food-swipe/internal/recipe/core"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Register(mux *http.ServeMux, pool *pgxpool.Pool) {
	storageAdapter := storage.New(pool)
	core := core.New(storageAdapter)
	grpcAdapter := grpc.New(core)

	path, handler := foodswipev1connect.NewRecipeServiceHandler(
		grpcAdapter,
		connect.WithInterceptors(validate.NewInterceptor()),
	)
	mux.Handle(path, handler)
}
