package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) ListRecipeSteps(ctx context.Context, recipeID string) ([]models.RecipeStep, error) {
	steps, err := r.storage.ListRecipeSteps(ctx, recipeID)
	if err != nil {
		return nil, fmt.Errorf("failed to list recipe steps: %w", err)
	}
	return steps, nil
}
