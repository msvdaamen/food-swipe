package storage

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"strings"
)

func (s *Storage) FindUserById(userId int32) (*User, error) {
	sql := fmt.Sprintf("select %s from users where id = $1 limit 1", strings.Join(userFields, ","))
	rows, err := s.db.Query(context.Background(), sql, userId)
	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[User])
	if err != nil {
		return nil, err
	}
	return &user, nil
}
