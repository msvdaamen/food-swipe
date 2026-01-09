package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) DeleteRecipeStep(ctx context.Context, req *v1.DeleteRecipeStepRequest) (*v1.DeleteRecipeStepResponse, error) {
	err := a.core.DeleteRecipeStep(ctx, req.RecipeId, req.StepId)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.DeleteRecipeStepResponse{}, nil
}
