package ingredient

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const updateIngredientSql = `UPDATE ingredients SET name = $2 WHERE id = $1 RETURNING id, name`

func (a *Ingredient) UpdateIngredient(ctx context.Context, id uint32, payload models.UpdateIngredient) (models.Ingredient, error) {
	row := a.db.QueryRow(ctx, updateIngredientSql, id, payload.Name)

	var ingredient models.Ingredient
	err := row.Scan(&ingredient.ID, &ingredient.Name)

	if err != nil {
		return models.Ingredient{}, fmt.Errorf("failed to scan row: %w", err)
	}

	return ingredient, nil
}
