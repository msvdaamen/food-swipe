package storage

import (
	"context"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// CreateUser creates a new user in the database
func (a *Adapter) CreateUser(ctx context.Context, user *models.User) error {
	query := `
		INSERT INTO users (id, email, email_verified, username, display_username, name, password_hash, image, role, banned, ban_reason, ban_expires)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
	`

	_, err := a.db.Exec(ctx, query,
		user.ID,
		user.Email,
		user.EmailVerified,
		user.Username,
		user.DisplayUsername,
		user.Name,
		user.PasswordHash,
		user.Image,
		user.Role,
		user.Banned,
		user.BanReason,
		user.BanExpires,
	)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

// GetUserByID retrieves a user by their ID
func (a *Adapter) GetUserByID(ctx context.Context, userID uuid.UUID) (*models.User, error) {
	query := `
		SELECT id, email, email_verified, username, display_username, name, password_hash, image, role, banned, ban_reason, ban_expires, created_at, updated_at
		FROM users
		WHERE id = $1
	`

	user := &models.User{}
	err := a.db.QueryRow(ctx, query, userID).Scan(
		&user.ID,
		&user.Email,
		&user.EmailVerified,
		&user.Username,
		&user.DisplayUsername,
		&user.Name,
		&user.PasswordHash,
		&user.Image,
		&user.Role,
		&user.Banned,
		&user.BanReason,
		&user.BanExpires,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user by ID: %w", err)
	}

	return user, nil
}

// GetUserByEmail retrieves a user by their email address
func (a *Adapter) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `
		SELECT id, email, email_verified, username, display_username, name, password_hash, image, role, banned, ban_reason, ban_expires, created_at, updated_at
		FROM users
		WHERE email = $1
	`

	user := &models.User{}
	err := a.db.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.EmailVerified,
		&user.Username,
		&user.DisplayUsername,
		&user.Name,
		&user.PasswordHash,
		&user.Image,
		&user.Role,
		&user.Banned,
		&user.BanReason,
		&user.BanExpires,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	return user, nil
}

// GetUserByUsername retrieves a user by their username
func (a *Adapter) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	query := `
		SELECT id, email, email_verified, username, display_username, name, password_hash, image, role, banned, ban_reason, ban_expires, created_at, updated_at
		FROM users
		WHERE username = $1
	`

	user := &models.User{}
	err := a.db.QueryRow(ctx, query, username).Scan(
		&user.ID,
		&user.Email,
		&user.EmailVerified,
		&user.Username,
		&user.DisplayUsername,
		&user.Name,
		&user.PasswordHash,
		&user.Image,
		&user.Role,
		&user.Banned,
		&user.BanReason,
		&user.BanExpires,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}

	return user, nil
}

// UpdateUser updates a user's information
func (a *Adapter) UpdateUser(ctx context.Context, user *models.User) error {
	query := `
		UPDATE users
		SET email = $2, email_verified = $3, username = $4, display_username = $5, name = $6,
		    password_hash = $7, image = $8, role = $9, banned = $10, ban_reason = $11, ban_expires = $12
		WHERE id = $1
	`

	result, err := a.db.Exec(ctx, query,
		user.ID,
		user.Email,
		user.EmailVerified,
		user.Username,
		user.DisplayUsername,
		user.Name,
		user.PasswordHash,
		user.Image,
		user.Role,
		user.Banned,
		user.BanReason,
		user.BanExpires,
	)

	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

// UpdatePassword updates a user's password hash
func (a *Adapter) UpdatePassword(ctx context.Context, userID uuid.UUID, passwordHash string) error {
	query := `UPDATE users SET password_hash = $2 WHERE id = $1`

	result, err := a.db.Exec(ctx, query, userID, passwordHash)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

// UpdateEmailVerified updates a user's email verification status
func (a *Adapter) UpdateEmailVerified(ctx context.Context, userID uuid.UUID, verified bool) error {
	query := `UPDATE users SET email_verified = $2 WHERE id = $1`

	result, err := a.db.Exec(ctx, query, userID, verified)
	if err != nil {
		return fmt.Errorf("failed to update email verified: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

// UpdateUsername updates a user's username
func (a *Adapter) UpdateUsername(ctx context.Context, userID uuid.UUID, username string) error {
	query := `UPDATE users SET username = $2 WHERE id = $1`

	result, err := a.db.Exec(ctx, query, userID, username)
	if err != nil {
		return fmt.Errorf("failed to update username: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

// UpdateDisplayUsername updates a user's display username
func (a *Adapter) UpdateDisplayUsername(ctx context.Context, userID uuid.UUID, displayUsername *string) error {
	query := `UPDATE users SET display_username = $2 WHERE id = $1`

	result, err := a.db.Exec(ctx, query, userID, displayUsername)
	if err != nil {
		return fmt.Errorf("failed to update display username: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}
