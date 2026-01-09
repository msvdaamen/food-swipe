package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) ListRecipeIngredients(ctx context.Context, recipeID string) ([]models.RecipeIngredient, error) {
	ingredients, err := r.storage.ListRecipeIngredients(ctx, recipeID)
	if err != nil {
		return nil, fmt.Errorf("failed to list recipe ingredients: %w", err)
	}
	return ingredients, nil
}
