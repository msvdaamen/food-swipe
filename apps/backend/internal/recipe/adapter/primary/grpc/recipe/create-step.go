package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) CreateRecipeStep(ctx context.Context, req *v1.CreateRecipeStepRequest) (*v1.CreateRecipeStepResponse, error) {
	step, err := a.core.CreateRecipeStep(ctx, req.RecipeId, toCreateRecipeStepInput(req))
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.CreateRecipeStepResponse{
		Step: toProtoRecipeStep(step),
	}, nil
}
