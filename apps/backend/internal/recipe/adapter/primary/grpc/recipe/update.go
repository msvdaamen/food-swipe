package recipe

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Recipe) UpdateRecipe(ctx context.Context, req *v1.UpdateRecipeRequest) (*v1.UpdateRecipeResponse, error) {
	recipe, err := a.core.UpdateRecipe(ctx, req.Id, models.UpdateRecipeInput{
		Title:       req.Title,
		Description: req.Description,
		PrepTime:    req.PrepTime,
		Servings:    req.Servings,
		IsPublished: req.IsPublished,
		FieldMask:   req.FieldMask.GetPaths(),
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeUnknown, err)
	}

	return &v1.UpdateRecipeResponse{
		Recipe: toProtoRecipe(recipe),
	}, nil
}
