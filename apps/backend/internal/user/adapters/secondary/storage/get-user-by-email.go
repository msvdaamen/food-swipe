package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
)

const selectUserByEmail = "SELECT %s FROM users WHERE email = $1"

func (a *Adapter) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	row := a.db.QueryRow(ctx, fmt.Sprintf(selectUserByEmail, userFields), email)
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
