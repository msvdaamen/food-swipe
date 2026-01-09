package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) UpdateRecipeStep(ctx context.Context, recipeID string, stepID uint32, payload models.UpdateRecipeStepInput) (*models.RecipeStep, error) {
	step, err := r.storage.UpdateRecipeStep(ctx, recipeID, stepID, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to update recipe step: %w", err)
	}
	return step, nil
}
