package storage

import (
	"context"
	"fmt"
	"strings"
)

func (s Storage) FindAllUsers() (*[]User, error) {
	sql := fmt.Sprintf("select %s from users", strings.Join(userFields, ","))
	rows, err := s.db.Query(context.Background(), sql)
	if err != nil {
		return nil, fmt.Errorf("error getting all users: %v", err)
	}
	defer rows.Close()
	var users []User
	for rows.Next() {
		user, err := scanIntoUser(rows)
		if err != nil {
			return nil, fmt.Errorf("error scanning all users: %v", err)
		}
		users = append(users, *user)
	}
	return &users, nil
}
