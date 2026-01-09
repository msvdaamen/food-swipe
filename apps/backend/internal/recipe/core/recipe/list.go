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
	return recipes, nil
}
