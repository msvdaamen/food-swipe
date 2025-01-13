package storage

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"strings"
)

func (s *Storage) FindAllUsers() (*[]User, error) {
	sql := fmt.Sprintf("select %s from users", strings.Join(userFields, ","))
	rows, err := s.db.Query(context.Background(), sql)
	if err != nil {
		return nil, fmt.Errorf("error getting all users: %v", err)
	}
	defer rows.Close()
	users, err := pgx.CollectRows(rows, pgx.RowToStructByName[User])
	if err != nil {
		return nil, fmt.Errorf("error scanning all users: %v", err)
	}
	return &users, nil
}
