package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Recipe) UploadRecipeImage(ctx context.Context, req *v1.UploadRecipeImageRequest) (*v1.UploadRecipeImageResponse, error) {
	recipe, err := a.core.UploadRecipeImage(ctx, req.Id, req.ImageData)
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.UploadRecipeImageResponse{
		Recipe: toProtoRecipe(recipe),
	}, nil
}
