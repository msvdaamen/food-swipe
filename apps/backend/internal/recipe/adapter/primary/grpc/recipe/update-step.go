package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) UpdateRecipeStep(ctx context.Context, req *v1.UpdateRecipeStepRequest) (*v1.UpdateRecipeStepResponse, error) {
	step, err := a.core.UpdateRecipeStep(ctx, req.RecipeId, req.StepId, toUpdateRecipeStepInput(req))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.UpdateRecipeStepResponse{
		Step: toProtoRecipeStep(step),
	}, nil
}
