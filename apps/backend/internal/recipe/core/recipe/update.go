package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) UpdateRecipe(ctx context.Context, id string, payload models.UpdateRecipeInput) (*models.Recipe, error) {
	recipe, err := r.storage.UpdateRecipe(ctx, id, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to update recipe: %w", err)
	}
	return recipe, nil
}
