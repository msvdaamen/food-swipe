package recipe

import (
	"context"
	"fmt"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) ListRecipes(ctx context.Context, req *v1.ListRecipesRequest) (*v1.ListRecipesResponse, error) {
	paginated, err := a.core.ListRecipes(ctx, toListRecipesFilter(req))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, fmt.Errorf("failed to list recipes: %w", err))
	}

	recipes := make([]*v1.Recipe, len(paginated.Data))
	for i, recipe := range paginated.Data {
		recipes[i] = toProtoRecipe(&recipe)
	}

	return &v1.ListRecipesResponse{
		Pagination: paginated.Pagination.ToGrpcPagination(),
		Data:       recipes,
	}, nil
}
