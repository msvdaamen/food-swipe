package storage

import (
	"context"
	"fmt"
	"strings"
)

func (s *Storage) UpdateIngredient(id int32, name string) (*Ingredient, error) {
	sql := fmt.Sprintf(`update ingredients set name = $1 where id = $2 returning %s`, strings.Join(ingredientFields, ", "))
	row := s.db.QueryRow(context.Background(), sql, name, id)
	ingredient, err := scanIntoIngredient(row)
	if err != nil {
		return nil, err
	}
	return ingredient, nil
}
