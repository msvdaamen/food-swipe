package ingredient

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Ingredient) UpdateIngredient(ctx context.Context, req *v1.UpdateIngredientRequest) (*v1.UpdateIngredientResponse, error) {
	ingredient, err := a.core.UpdateIngredient(ctx, req.Id, models.UpdateIngredient{
		Name: req.Name,
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.UpdateIngredientResponse{
		Ingredient: modelIngredientToGrpcIngredient(ingredient),
	}, nil
}
