package ingredient

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const getIngredientSql = "SELECT id, name FROM ingredients WHERE id = $1"

func (a *Ingredient) GetIngredient(ctx context.Context, id int32) (models.Ingredient, error) {

	row := a.db.QueryRow(ctx, getIngredientSql, id)
	var ingredient models.Ingredient
	err := row.Scan(&ingredient.ID, &ingredient.Name)
	if err != nil {
		return models.Ingredient{}, fmt.Errorf("failed to scan row: %w", err)
	}

	return ingredient, nil
}
