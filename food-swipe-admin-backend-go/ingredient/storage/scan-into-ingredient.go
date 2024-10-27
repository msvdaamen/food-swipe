package storage

import "github.com/jackc/pgx/v5"

func scanIntoIngredient(row pgx.Row) (*Ingredient, error) {
	ingredient := Ingredient{}
	err := row.Scan(
		&ingredient.Id,
		&ingredient.Name,
	)
	return &ingredient, err
}
