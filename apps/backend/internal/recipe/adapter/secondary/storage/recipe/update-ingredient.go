package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const updateRecipeIngredientSql = `
UPDATE recipe_ingredients
SET measurement_id = $1, amount = $2
WHERE recipe_id = $3 AND ingredient_id = $4
`

func (a *Recipe) UpdateRecipeIngredient(ctx context.Context, recipeID string, ingredientID uint32, payload models.UpdateRecipeIngredientInput) (*models.RecipeIngredient, error) {
	result, err := a.db.Exec(
		ctx,
		updateRecipeIngredientSql,
		payload.MeasurementID,
		payload.Amount,
		recipeID,
		ingredientID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update recipe ingredient: %w", err)
	}

	if result.RowsAffected() == 0 {
		return nil, fmt.Errorf("recipe ingredient not found")
	}

	ingredient, err := a.GetRecipeIngredient(ctx, recipeID, ingredientID)
	if err != nil {
		return nil, fmt.Errorf("failed to get updated recipe ingredient: %w", err)
	}
	return ingredient, nil
}
