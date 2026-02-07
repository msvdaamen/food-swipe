package storage

import (
	"errors"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const userFields = `
	id,
	name,
	email,
	email_verified,
	image,
	username,
	display_username,
	role,
	banned,
	ban_reason,
	ban_expires,
	created_at,
	updated_at
`

type Adapter struct {
	db *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Adapter {
	return &Adapter{
		db: pool,
	}
}

var ErrUserNotFound = errors.New("user not found")

func scanUser(row pgx.Row) (models.User, error) {
	var user models.User
	err := row.Scan(
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
	)
	if err != nil {
		return models.User{}, fmt.Errorf("failed to scan user: %w", err)
	}
	return user, nil
}
