package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) ReorderRecipeStep(ctx context.Context, req *v1.ReorderRecipeStepRequest) (*v1.ReorderRecipeStepResponse, error) {
	steps, err := a.core.ReorderRecipeStep(ctx, req.RecipeId, req.StepId, toReorderRecipeStepInput(req))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	protoSteps := make([]*v1.RecipeStep, len(steps))
	for i, step := range steps {
		protoSteps[i] = toProtoRecipeStep(&step)
	}

	return &v1.ReorderRecipeStepResponse{
		Steps: protoSteps,
	}, nil
}
