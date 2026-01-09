package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) UpdateRecipe(ctx context.Context, req *v1.UpdateRecipeRequest) (*v1.UpdateRecipeResponse, error) {
	recipe, err := a.core.UpdateRecipe(ctx, req.Id, toUpdateRecipeInput(req))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.UpdateRecipeResponse{
		Recipe: toProtoRecipe(recipe),
	}, nil
}
