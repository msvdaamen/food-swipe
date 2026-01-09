package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) ListRecipeIngredients(ctx context.Context, req *v1.ListRecipeIngredientsRequest) (*v1.ListRecipeIngredientsResponse, error) {
	ingredients, err := a.core.ListRecipeIngredients(ctx, req.RecipeId)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	protoIngredients := make([]*v1.RecipeIngredient, len(ingredients))
	for i, ingredient := range ingredients {
		protoIngredients[i] = toProtoRecipeIngredient(&ingredient)
	}

	return &v1.ListRecipeIngredientsResponse{
		Ingredients: protoIngredients,
	}, nil
}
