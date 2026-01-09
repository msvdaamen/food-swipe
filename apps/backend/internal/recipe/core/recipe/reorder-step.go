package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) ReorderRecipeStep(ctx context.Context, recipeID string, stepID uint32, payload models.ReorderRecipeStepInput) ([]models.RecipeStep, error) {
	steps, err := r.storage.ReorderRecipeStep(ctx, recipeID, stepID, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to reorder recipe step: %w", err)
	}
	return steps, nil
}
