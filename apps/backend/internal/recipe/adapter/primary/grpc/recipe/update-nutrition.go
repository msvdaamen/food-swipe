package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) UpdateRecipeNutrition(ctx context.Context, req *v1.UpdateRecipeNutritionRequest) (*v1.UpdateRecipeNutritionResponse, error) {
	nutrition, err := a.core.UpdateRecipeNutrition(ctx, req.RecipeId, toUpdateNutritionInput(req))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.UpdateRecipeNutritionResponse{
		Nutrition: toProtoNutrition(nutrition),
	}, nil
}
