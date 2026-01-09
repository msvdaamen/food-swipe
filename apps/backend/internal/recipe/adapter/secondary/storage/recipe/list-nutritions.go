package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const listRecipeNutritionsSql = `
SELECT id, recipe_id, name, unit, value
FROM recipe_nutritions
WHERE recipe_id = $1
ORDER BY name
`

func (a *Recipe) ListRecipeNutritions(ctx context.Context, recipeID string) ([]models.Nutrition, error) {
	rows, err := a.db.Query(ctx, listRecipeNutritionsSql, recipeID)
	if err != nil {
		return nil, fmt.Errorf("failed to read rows: %w", err)
	}
	defer rows.Close()

	nutritions := []models.Nutrition{}
	for rows.Next() {
		var nutrition models.Nutrition
		err := rows.Scan(
			&nutrition.ID,
			&nutrition.RecipeID,
			&nutrition.Name,
			&nutrition.Unit,
			&nutrition.Value,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		nutritions = append(nutritions, nutrition)
	}

	return nutritions, nil
}
