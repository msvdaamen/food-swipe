package storage

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// CreateRefreshToken creates a new refresh token in the database
func (a *Adapter) CreateRefreshToken(ctx context.Context, token *models.RefreshToken) error {
	query := `
		INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, revoked, revoked_at, device_info, ip_address)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`

	_, err := a.db.Exec(ctx, query,
		token.ID,
		token.UserID,
		token.TokenHash,
		token.ExpiresAt,
		token.Revoked,
		token.RevokedAt,
		token.DeviceInfo,
		token.IPAddress,
	)

	if err != nil {
		return fmt.Errorf("failed to create refresh token: %w", err)
	}

	return nil
}

// GetRefreshTokenByHash retrieves a refresh token by its hash
func (a *Adapter) GetRefreshTokenByHash(ctx context.Context, tokenHash string) (*models.RefreshToken, error) {
	query := `
		SELECT id, user_id, token_hash, expires_at, revoked, revoked_at, device_info, ip_address, created_at
		FROM refresh_tokens
		WHERE token_hash = $1
	`

	token := &models.RefreshToken{}
	err := a.db.QueryRow(ctx, query, tokenHash).Scan(
		&token.ID,
		&token.UserID,
		&token.TokenHash,
		&token.ExpiresAt,
		&token.Revoked,
		&token.RevokedAt,
		&token.DeviceInfo,
		&token.IPAddress,
		&token.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("refresh token not found")
		}
		return nil, fmt.Errorf("failed to get refresh token: %w", err)
	}

	return token, nil
}

// RevokeRefreshToken revokes a specific refresh token
func (a *Adapter) RevokeRefreshToken(ctx context.Context, tokenHash string) error {
	query := `
		UPDATE refresh_tokens
		SET revoked = true, revoked_at = $2
		WHERE token_hash = $1
	`

	result, err := a.db.Exec(ctx, query, tokenHash, time.Now())
	if err != nil {
		return fmt.Errorf("failed to revoke refresh token: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("refresh token not found")
	}

	return nil
}

// RevokeAllUserRefreshTokens revokes all refresh tokens for a specific user
func (a *Adapter) RevokeAllUserRefreshTokens(ctx context.Context, userID uuid.UUID) error {
	query := `
		UPDATE refresh_tokens
		SET revoked = true, revoked_at = $2
		WHERE user_id = $1 AND revoked = false
	`

	_, err := a.db.Exec(ctx, query, userID, time.Now())
	if err != nil {
		return fmt.Errorf("failed to revoke all user refresh tokens: %w", err)
	}

	return nil
}

// DeleteExpiredRefreshTokens removes all expired refresh tokens from the database
func (a *Adapter) DeleteExpiredRefreshTokens(ctx context.Context) error {
	query := `DELETE FROM refresh_tokens WHERE expires_at < $1`

	_, err := a.db.Exec(ctx, query, time.Now())
	if err != nil {
		return fmt.Errorf("failed to delete expired refresh tokens: %w", err)
	}

	return nil
}
