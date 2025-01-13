package storage

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"strings"
)

func (s *Storage) CreateIngredient(name string) (*Ingredient, error) {
	sql := fmt.Sprintf(`insert into ingredients (name) values ($1) returning %s`, strings.Join(ingredientFields, ", "))
	row, err := s.db.Query(context.Background(), sql, name)
	if err != nil {
		return nil, err
	}
	ingredient, err := pgx.CollectOneRow(row, pgx.RowToStructByName[Ingredient])
	if err != nil {
		return nil, err
	}
	return &ingredient, nil
}
