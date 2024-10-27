package storage

import (
	"context"
	"fmt"
	"strings"
)

func (s *Storage) CreateIngredient(name string) (*Ingredient, error) {
	sql := fmt.Sprintf(`insert into ingredients (name) values ($1) returning %s`, strings.Join(ingredientFields, ", "))
	row := s.db.QueryRow(context.Background(), sql, name)
	ingredient, err := scanIntoIngredient(row)
	if err != nil {
		return nil, err
	}
	return ingredient, nil
}
