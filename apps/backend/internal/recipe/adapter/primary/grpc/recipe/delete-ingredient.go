package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) DeleteRecipeIngredient(ctx context.Context, req *v1.DeleteRecipeIngredientRequest) (*v1.DeleteRecipeIngredientResponse, error) {
	err := a.core.DeleteRecipeIngredient(ctx, req.RecipeId, req.IngredientId)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.DeleteRecipeIngredientResponse{}, nil
}
