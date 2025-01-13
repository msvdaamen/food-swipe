package storage

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"strings"
)

func (s *Storage) UpdateIngredient(id int32, name string) (*Ingredient, error) {
	sql := fmt.Sprintf(`update ingredients set name = $1 where id = $2 returning %s`, strings.Join(ingredientFields, ", "))
	rows, err := s.db.Query(context.Background(), sql, name, id)
	ingredient, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Ingredient])
	if err != nil {
		return nil, err
	}
	return &ingredient, nil
}
