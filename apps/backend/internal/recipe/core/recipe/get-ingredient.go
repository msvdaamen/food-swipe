package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) GetRecipeIngredient(ctx context.Context, recipeID string, ingredientID uint32) (*models.RecipeIngredient, error) {
	ingredient, err := r.storage.GetRecipeIngredient(ctx, recipeID, ingredientID)
	if err != nil {
		return nil, fmt.Errorf("failed to get recipe ingredient: %w", err)
	}
	return ingredient, nil
}
