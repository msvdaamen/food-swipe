package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) DeleteRecipe(ctx context.Context, req *v1.DeleteRecipeRequest) (*v1.DeleteRecipeResponse, error) {
	err := a.core.DeleteRecipe(ctx, req.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.DeleteRecipeResponse{}, nil
}
