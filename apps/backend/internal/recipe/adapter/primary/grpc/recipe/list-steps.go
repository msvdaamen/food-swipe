package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) ListRecipeSteps(ctx context.Context, req *v1.ListRecipeStepsRequest) (*v1.ListRecipeStepsResponse, error) {
	steps, err := a.core.ListRecipeSteps(ctx, req.RecipeId)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	protoSteps := make([]*v1.RecipeStep, len(steps))
	for i, step := range steps {
		protoSteps[i] = toProtoRecipeStep(&step)
	}

	return &v1.ListRecipeStepsResponse{
		Steps: protoSteps,
	}, nil
}
