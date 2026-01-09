package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) ListRecipeNutritions(ctx context.Context, req *v1.ListRecipeNutritionsRequest) (*v1.ListRecipeNutritionsResponse, error) {
	nutritions, err := a.core.ListRecipeNutritions(ctx, req.RecipeId)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	protoNutritions := make([]*v1.Nutrition, len(nutritions))
	for i, nutrition := range nutritions {
		protoNutritions[i] = toProtoNutrition(&nutrition)
	}

	return &v1.ListRecipeNutritionsResponse{
		Nutritions: protoNutritions,
	}, nil
}
