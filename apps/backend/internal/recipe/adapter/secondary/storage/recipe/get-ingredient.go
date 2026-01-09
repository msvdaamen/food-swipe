package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
	"github.com/jackc/pgx/v5"
)

const getRecipeIngredientSql = `
SELECT
	ri.recipe_id, ri.ingredient_id, ri.measurement_id, ri.amount,
	i.id as ing_id, i.name as ing_name,
	m.id as meas_id, m.name as meas_name, m.abbreviation as meas_abbr
FROM recipe_ingredients ri
INNER JOIN ingredients i ON ri.ingredient_id = i.id
LEFT JOIN measurements m ON ri.measurement_id = m.id
WHERE ri.recipe_id = $1 AND ri.ingredient_id = $2
`

func (a *Recipe) GetRecipeIngredient(ctx context.Context, recipeID string, ingredientID uint32) (*models.RecipeIngredient, error) {
	var (
		recID      string
		ingID      uint32
		measID     *uint32
		amount     uint32
		ingIDFull  uint32
		ingName    string
		measIDFull *uint32
		measName   *string
		measAbbr   *string
	)

	err := a.db.QueryRow(ctx, getRecipeIngredientSql, recipeID, ingredientID).Scan(
		&recID, &ingID, &measID, &amount,
		&ingIDFull, &ingName,
		&measIDFull, &measName, &measAbbr,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("recipe ingredient not found")
		}
		return nil, fmt.Errorf("failed to get recipe ingredient: %w", err)
	}

	ingredient := &models.RecipeIngredient{
		RecipeID:      recID,
		IngredientID:  ingID,
		MeasurementID: measID,
		Amount:        amount,
		Ingredient:    ingName,
		Measurement:   measName,
	}

	return ingredient, nil
}
