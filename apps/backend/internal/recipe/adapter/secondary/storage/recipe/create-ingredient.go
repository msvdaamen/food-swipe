package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const createRecipeIngredientSql = `
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, measurement_id, amount)
VALUES ($1, $2, $3, $4)
`

func (a *Recipe) CreateRecipeIngredient(ctx context.Context, recipeID string, payload models.CreateRecipeIngredientInput) (*models.RecipeIngredient, error) {
	_, err := a.db.Exec(
		ctx,
		createRecipeIngredientSql,
		recipeID,
		payload.IngredientID,
		payload.MeasurementID,
		payload.Amount,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create recipe ingredient: %w", err)
	}

	ingredient, err := a.GetRecipeIngredient(ctx, recipeID, payload.IngredientID)
	if err != nil {
		return nil, fmt.Errorf("failed to get created recipe ingredient: %w", err)
	}
	return ingredient, nil
}
