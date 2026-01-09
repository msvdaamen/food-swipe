package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) ListRecipeNutritions(ctx context.Context, recipeID string) ([]models.Nutrition, error) {
	nutritions, err := r.storage.ListRecipeNutritions(ctx, recipeID)
	if err != nil {
		return nil, fmt.Errorf("failed to list recipe nutritions: %w", err)
	}
	return nutritions, nil
}
