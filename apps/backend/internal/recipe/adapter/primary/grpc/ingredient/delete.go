package ingredient

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Ingredient) DeleteIngredient(ctx context.Context, req *v1.DeleteIngredientRequest) (*v1.DeleteIngredientResponse, error) {
	err := a.core.DeleteIngredient(ctx, req.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.DeleteIngredientResponse{}, nil
}
