package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
)

const selectUserByID = "SELECT %s FROM users WHERE id = $1"

func (a *Adapter) GetUserByID(ctx context.Context, userID string) (*models.User, error) {
	row := a.db.QueryRow(ctx, fmt.Sprintf(selectUserByID, userFields), userID)
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
