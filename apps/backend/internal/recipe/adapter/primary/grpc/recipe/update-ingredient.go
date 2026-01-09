package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) UpdateRecipeIngredient(ctx context.Context, req *v1.UpdateRecipeIngredientRequest) (*v1.UpdateRecipeIngredientResponse, error) {
	ingredient, err := a.core.UpdateRecipeIngredient(ctx, req.RecipeId, req.IngredientId, toUpdateRecipeIngredientInput(req))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.UpdateRecipeIngredientResponse{
		Ingredient: toProtoRecipeIngredient(ingredient),
	}, nil
}
