package storage

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"strings"
)

func (s *Storage) FindUserByEmail(email string) (*User, error) {
	sql := fmt.Sprintf("SELECT %s FROM Users WHERE email = $1", strings.Join(userFields, ","))
	rows, err := s.db.Query(context.Background(), sql, email)
	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[User])
	if err != nil {
		return nil, err
	}
	return &user, nil
}
