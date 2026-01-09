package ingredient

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Ingredient) CreateIngredient(ctx context.Context, req *v1.CreateIngredientRequest) (*v1.CreateIngredientResponse, error) {
	ingredient, err := a.core.CreateIngredient(ctx, models.CreateIngredient{
		Name: req.Name,
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.CreateIngredientResponse{
		Ingredient: modelIngredientToGrpcIngredient(ingredient),
	}, nil
}
