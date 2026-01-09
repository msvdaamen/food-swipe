package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) LikeRecipe(ctx context.Context, req *v1.LikeRecipeRequest) (*v1.LikeRecipeResponse, error) {
	recipe, err := a.core.LikeRecipe(ctx, req.UserId, req.RecipeId, req.Like)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.LikeRecipeResponse{
		Recipe: toProtoRecipe(recipe),
	}, nil
}
