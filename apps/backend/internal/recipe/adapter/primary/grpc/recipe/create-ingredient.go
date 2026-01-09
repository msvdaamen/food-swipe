package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) CreateRecipeIngredient(ctx context.Context, req *v1.CreateRecipeIngredientRequest) (*v1.CreateRecipeIngredientResponse, error) {
	ingredient, err := a.core.CreateRecipeIngredient(ctx, req.RecipeId, toCreateRecipeIngredientInput(req))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.CreateRecipeIngredientResponse{
		Ingredient: toProtoRecipeIngredient(ingredient),
	}, nil
}
