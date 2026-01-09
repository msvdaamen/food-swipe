package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) ListRecipes(ctx context.Context, filter models.ListRecipesFilter) (*pagination.PaginationResponse[models.Recipe], error) {
	recipes, err := r.storage.ListRecipes(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to list recipes: %w", err)
	}
	for i := range recipes.Data {
		if recipes.Data[i].CoverImage != nil {
			coverImageURL := r.fileStorage.PublicURL(*recipes.Data[i].CoverImage)
			recipes.Data[i].CoverImageUrl = &coverImageURL
		}
	}
	return recipes, nil
}
