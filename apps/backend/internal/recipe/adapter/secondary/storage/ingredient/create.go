package ingredient

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const insertIngredientSql = "INSERT INTO ingredients (name) VALUES ($1) RETURNING id, name"

func (a *Ingredient) CreateIngredient(ctx context.Context, payload models.CreateIngredient) (models.Ingredient, error) {

	row := a.db.QueryRow(ctx, insertIngredientSql, payload.Name)

	var ingredient models.Ingredient
	err := row.Scan(ingredient.ID, ingredient.Name)
	if err != nil {
		return models.Ingredient{}, fmt.Errorf("failed to scan row: %w", err)
	}

	return ingredient, nil
}
