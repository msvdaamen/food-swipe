package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) UpdateRecipeIngredient(ctx context.Context, recipeID string, ingredientID uint32, payload models.UpdateRecipeIngredientInput) (*models.RecipeIngredient, error) {
	ingredient, err := r.storage.UpdateRecipeIngredient(ctx, recipeID, ingredientID, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to update recipe ingredient: %w", err)
	}
	return ingredient, nil
}
