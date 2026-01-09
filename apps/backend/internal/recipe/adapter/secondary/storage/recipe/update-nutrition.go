package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const upsertRecipeNutritionSql = `
INSERT INTO recipe_nutritions (recipe_id, name, unit, value)
VALUES ($1, $2, $3, $4)
ON CONFLICT (recipe_id, name)
DO UPDATE SET unit = EXCLUDED.unit, value = EXCLUDED.value
RETURNING id, recipe_id, name, unit, value
`

func (a *Recipe) UpdateRecipeNutrition(ctx context.Context, recipeID string, payload models.UpdateNutritionInput) (*models.Nutrition, error) {
	var nutrition models.Nutrition
	err := a.db.QueryRow(
		ctx,
		upsertRecipeNutritionSql,
		recipeID,
		payload.Name,
		payload.Unit,
		payload.Value,
	).Scan(
		&nutrition.ID,
		&nutrition.RecipeID,
		&nutrition.Name,
		&nutrition.Unit,
		&nutrition.Value,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to upsert nutrition: %w", err)
	}

	return &nutrition, nil
}
