package ingredient

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/recipe/core/models"
)

const listIngredientsSql = "SELECT id, name FROM ingredients"
const countIngredientsSql = "SELECT COUNT(*) FROM ingredients"

func (a *Ingredient) ListIngredients(ctx context.Context, payload models.ListIngredients) (*pagination.PaginationResponse[models.Ingredient], error) {
	params := []any{}
	countParams := []any{}

	filterSql := ""

	if payload.Search != nil {
		filterSql += fmt.Sprintf(" WHERE name LIKE $%d", len(params)+1)
		params = append(params, fmt.Sprintf("%%%s%%", *payload.Search))
		countParams = append(countParams, fmt.Sprintf("%%%s%%", *payload.Search))
	}

	limitSql := fmt.Sprintf(" LIMIT $%d OFFSET $%d", len(params)+1, len(params)+2)
	params = append(params, payload.Limit, (payload.Page-1)*payload.Limit)

	rows, err := a.db.Query(ctx, listIngredientsSql+filterSql+limitSql, params...)
	if err != nil {
		return nil, fmt.Errorf("failed to read rows: %w", err)
	}
	defer rows.Close()
	ingredients := []models.Ingredient{}
	for rows.Next() {
		var ingredient models.Ingredient
		err := rows.Scan(&ingredient.ID, &ingredient.Name)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		ingredients = append(ingredients, ingredient)
	}

	var count uint32
	err = a.db.QueryRow(ctx, countIngredientsSql+filterSql, countParams...).Scan(&count)
	if err != nil {
		return nil, fmt.Errorf("failed to count rows: %w", err)
	}

	return pagination.New(ingredients, count, payload.Page, payload.Limit), nil
}
