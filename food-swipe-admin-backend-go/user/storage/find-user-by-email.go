package storage

import (
	"context"
	"fmt"
	"strings"
)

func (s *Storage) FindUserByEmail(email string) (*User, error) {
	sql := fmt.Sprintf("SELECT %s FROM Users WHERE email = $1", strings.Join(userFields, ","))
	row := s.db.QueryRow(context.Background(), sql, email)
	user, err := scanIntoUser(row)
	if err != nil {
		return nil, err
	}
	return user, nil
}
