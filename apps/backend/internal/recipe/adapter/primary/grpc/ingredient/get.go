package ingredient

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Ingredient) GetIngredient(ctx context.Context, req *v1.GetIngredientRequest) (*v1.GetIngredientResponse, error) {
	ingredient, err := a.core.GetIngredient(ctx, req.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.GetIngredientResponse{
		Ingredient: modelIngredientToGrpcIngredient(ingredient),
	}, nil
}
