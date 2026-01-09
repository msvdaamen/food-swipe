package recipe

import (
	"context"
	"fmt"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) GetRecipe(ctx context.Context, req *v1.GetRecipeRequest) (*v1.GetRecipeResponse, error) {
	recipe, err := a.core.GetRecipe(ctx, req.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("failed to get recipe: %w", err))
	}

	return &v1.GetRecipeResponse{
		Recipe: toProtoRecipe(recipe),
	}, nil
}
