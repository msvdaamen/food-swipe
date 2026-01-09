package storage

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
)

const selectUserByID = "SELECT id, name, email, email_verified, image, username, display_username, role, banned, ban_reason, ban_expires, created_at, updated_at FROM users WHERE id = $1"

func (a *Adapter) GetUserByID(ctx context.Context, userID string) (*models.User, error) {
	row := a.db.QueryRow(ctx, selectUserByID, userID)
	var user models.User
	if err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.EmailVerified,
		&user.Image,
		&user.Username,
		&user.DisplayUsername,
		&user.Role,
		&user.Banned,
		&user.BanReason,
		&user.BanExpires,
		&user.CreatedAt,
		&user.UpdatedAt,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to scan user: %w", err)
	}
	return &user, nil
}
