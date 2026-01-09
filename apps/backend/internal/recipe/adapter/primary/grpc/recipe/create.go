package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) CreateRecipe(ctx context.Context, req *v1.CreateRecipeRequest) (*v1.CreateRecipeResponse, error) {
	recipe, err := a.core.CreateRecipe(ctx, toCreateRecipeInput(req))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.CreateRecipeResponse{
		Recipe: toProtoRecipe(recipe),
	}, nil
}
