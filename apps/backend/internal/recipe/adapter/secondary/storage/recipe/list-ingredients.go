package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const listRecipeIngredientsSql = `
SELECT
	ri.recipe_id, ri.ingredient_id, ri.measurement_id, ri.amount,
	i.id as ing_id, i.name as ing_name,
	m.id as meas_id, m.name as meas_name, m.abbreviation as meas_abbr
FROM recipe_ingredients ri
INNER JOIN ingredients i ON ri.ingredient_id = i.id
LEFT JOIN measurements m ON ri.measurement_id = m.id
WHERE ri.recipe_id = $1
ORDER BY ri.ingredient_id
`

func (a *Recipe) ListRecipeIngredients(ctx context.Context, recipeID string) ([]models.RecipeIngredient, error) {
	rows, err := a.db.Query(ctx, listRecipeIngredientsSql, recipeID)
	if err != nil {
		return nil, fmt.Errorf("failed to read rows: %w", err)
	}
	defer rows.Close()

	ingredients := []models.RecipeIngredient{}
	for rows.Next() {
		var (
			recipeID      string
			ingredientID  uint32
			measurementID *uint32
			amount        uint32
			ingID         uint32
			ingName       string
			measID        *uint32
			measName      *string
			measAbbr      *string
		)

		err := rows.Scan(
			&recipeID, &ingredientID, &measurementID, &amount,
			&ingID, &ingName,
			&measID, &measName, &measAbbr,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		ingredient := models.RecipeIngredient{
			RecipeID:      recipeID,
			IngredientID:  ingredientID,
			MeasurementID: measurementID,
			Amount:        amount,
			Ingredient:    ingName,
			Measurement:   measName,
		}

		ingredients = append(ingredients, ingredient)
	}

	return ingredients, nil
}
