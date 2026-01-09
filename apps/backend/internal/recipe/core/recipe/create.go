package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) CreateRecipe(ctx context.Context, payload models.CreateRecipeInput) (*models.Recipe, error) {
	recipe, err := r.storage.CreateRecipe(ctx, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to create recipe: %w", err)
	}
	return recipe, nil
}
