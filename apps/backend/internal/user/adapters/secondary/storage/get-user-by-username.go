package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
)

const selectUserByUsername = "SELECT %s FROM users WHERE username = $1"

func (a *Adapter) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	row := a.db.QueryRow(ctx, fmt.Sprintf(selectUserByUsername, userFields), username)
	var user models.User
	user, err := scanUser(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to scan user: %w", err)
	}
	return &user, nil
}
