package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) UpdateRecipeNutrition(ctx context.Context, recipeID string, payload models.UpdateNutritionInput) (*models.Nutrition, error) {
	nutrition, err := r.storage.UpdateRecipeNutrition(ctx, recipeID, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to update recipe nutrition: %w", err)
	}
	return nutrition, nil
}
