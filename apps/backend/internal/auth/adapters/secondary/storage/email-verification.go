package storage

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// CreateEmailVerificationToken creates a new email verification token in the database
func (a *Adapter) CreateEmailVerificationToken(ctx context.Context, userID uuid.UUID, token string, expiresAt int64) error {
	query := `
		INSERT INTO email_verification_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
	`

	_, err := a.db.Exec(ctx, query, userID, token, time.Unix(expiresAt, 0))
	if err != nil {
		return fmt.Errorf("failed to create email verification token: %w", err)
	}

	return nil
}

// GetEmailVerificationToken retrieves an email verification token from the database
func (a *Adapter) GetEmailVerificationToken(ctx context.Context, token string) (userID uuid.UUID, expiresAt int64, used bool, err error) {
	query := `
		SELECT user_id, EXTRACT(EPOCH FROM expires_at)::bigint, used
		FROM email_verification_tokens
		WHERE token = $1
	`

	err = a.db.QueryRow(ctx, query, token).Scan(&userID, &expiresAt, &used)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return uuid.Nil, 0, false, fmt.Errorf("email verification token not found")
		}
		return uuid.Nil, 0, false, fmt.Errorf("failed to get email verification token: %w", err)
	}

	return userID, expiresAt, used, nil
}

// MarkEmailVerificationTokenAsUsed marks an email verification token as used
func (a *Adapter) MarkEmailVerificationTokenAsUsed(ctx context.Context, token string) error {
	query := `UPDATE email_verification_tokens SET used = true WHERE token = $1`

	result, err := a.db.Exec(ctx, query, token)
	if err != nil {
		return fmt.Errorf("failed to mark email verification token as used: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("email verification token not found")
	}

	return nil
}
