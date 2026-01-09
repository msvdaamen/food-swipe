package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) CreateRecipeStep(ctx context.Context, recipeID string, payload models.CreateRecipeStepInput) (*models.RecipeStep, error) {
	step, err := r.storage.CreateRecipeStep(ctx, recipeID, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to create recipe step: %w", err)
	}
	return step, nil
}
