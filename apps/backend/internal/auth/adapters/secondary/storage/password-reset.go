package storage

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// CreatePasswordResetToken creates a new password reset token in the database
func (a *Adapter) CreatePasswordResetToken(ctx context.Context, userID uuid.UUID, token string, expiresAt time.Time) error {
	query := `
		INSERT INTO password_reset_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
	`

	_, err := a.db.Exec(ctx, query, userID, token, expiresAt)
	if err != nil {
		return fmt.Errorf("failed to create password reset token: %w", err)
	}

	return nil
}

// GetPasswordResetToken retrieves a password reset token from the database
func (a *Adapter) GetPasswordResetToken(ctx context.Context, token string) (userID uuid.UUID, expiresAt time.Time, used bool, err error) {
	query := `
		SELECT user_id, expires_at, used
		FROM password_reset_tokens
		WHERE token = $1
	`

	err = a.db.QueryRow(ctx, query, token).Scan(&userID, &expiresAt, &used)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return uuid.Nil, time.Time{}, false, fmt.Errorf("password reset token not found")
		}
		return uuid.Nil, time.Time{}, false, fmt.Errorf("failed to get password reset token: %w", err)
	}

	return userID, expiresAt, used, nil
}

// MarkPasswordResetTokenAsUsed marks a password reset token as used
func (a *Adapter) MarkPasswordResetTokenAsUsed(ctx context.Context, token string) error {
	query := `UPDATE password_reset_tokens SET used = true WHERE token = $1`

	result, err := a.db.Exec(ctx, query, token)
	if err != nil {
		return fmt.Errorf("failed to mark password reset token as used: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("password reset token not found")
	}

	return nil
}
