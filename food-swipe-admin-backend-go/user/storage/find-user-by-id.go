package storage

import (
	"context"
	"fmt"
	"strings"
)

func (s Storage) FindUserById(userId int32) (*User, error) {
	sql := fmt.Sprintf("select %s from users where id = $1 limit 1", strings.Join(userFields, ","))
	row := s.db.QueryRow(context.Background(), sql, userId)
	user, err := scanIntoUser(row)
	if err != nil {
		return nil, err
	}
	return user, nil
}
