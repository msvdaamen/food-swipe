package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) CreateRecipeIngredient(ctx context.Context, recipeID string, payload models.CreateRecipeIngredientInput) (*models.RecipeIngredient, error) {
	ingredient, err := r.storage.CreateRecipeIngredient(ctx, recipeID, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to create recipe ingredient: %w", err)
	}
	return ingredient, nil
}
