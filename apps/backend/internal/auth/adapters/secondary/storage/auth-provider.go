package storage

import (
	"context"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// CreateAuthProvider creates a new auth provider link in the database
func (a *Adapter) CreateAuthProvider(ctx context.Context, provider *models.AuthProvider) error {
	query := `
		INSERT INTO auth_providers (id, user_id, provider, provider_user_id, provider_email, access_token, refresh_token, token_expires_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`

	_, err := a.db.Exec(ctx, query,
		provider.ID,
		provider.UserID,
		provider.Provider,
		provider.ProviderUserID,
		provider.ProviderEmail,
		provider.AccessToken,
		provider.RefreshToken,
		provider.TokenExpiresAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create auth provider: %w", err)
	}

	return nil
}

// GetAuthProviderByProviderUserID retrieves an auth provider by provider name and provider user ID
func (a *Adapter) GetAuthProviderByProviderUserID(ctx context.Context, provider, providerUserID string) (*models.AuthProvider, error) {
	query := `
		SELECT id, user_id, provider, provider_user_id, provider_email, access_token, refresh_token, token_expires_at, created_at, updated_at
		FROM auth_providers
		WHERE provider = $1 AND provider_user_id = $2
	`

	authProvider := &models.AuthProvider{}
	err := a.db.QueryRow(ctx, query, provider, providerUserID).Scan(
		&authProvider.ID,
		&authProvider.UserID,
		&authProvider.Provider,
		&authProvider.ProviderUserID,
		&authProvider.ProviderEmail,
		&authProvider.AccessToken,
		&authProvider.RefreshToken,
		&authProvider.TokenExpiresAt,
		&authProvider.CreatedAt,
		&authProvider.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("auth provider not found")
		}
		return nil, fmt.Errorf("failed to get auth provider: %w", err)
	}

	return authProvider, nil
}

// GetAuthProvidersByUserID retrieves all auth providers for a user
func (a *Adapter) GetAuthProvidersByUserID(ctx context.Context, userID uuid.UUID) ([]*models.AuthProvider, error) {
	query := `
		SELECT id, user_id, provider, provider_user_id, provider_email, access_token, refresh_token, token_expires_at, created_at, updated_at
		FROM auth_providers
		WHERE user_id = $1
	`

	rows, err := a.db.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get auth providers: %w", err)
	}
	defer rows.Close()

	var providers []*models.AuthProvider
	for rows.Next() {
		provider := &models.AuthProvider{}
		err := rows.Scan(
			&provider.ID,
			&provider.UserID,
			&provider.Provider,
			&provider.ProviderUserID,
			&provider.ProviderEmail,
			&provider.AccessToken,
			&provider.RefreshToken,
			&provider.TokenExpiresAt,
			&provider.CreatedAt,
			&provider.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan auth provider: %w", err)
		}
		providers = append(providers, provider)
	}

	return providers, nil
}

// UpdateAuthProvider updates an auth provider's information
func (a *Adapter) UpdateAuthProvider(ctx context.Context, provider *models.AuthProvider) error {
	query := `
		UPDATE auth_providers
		SET provider_email = $3, access_token = $4, refresh_token = $5, token_expires_at = $6
		WHERE provider = $1 AND provider_user_id = $2
	`

	result, err := a.db.Exec(ctx, query,
		provider.Provider,
		provider.ProviderUserID,
		provider.ProviderEmail,
		provider.AccessToken,
		provider.RefreshToken,
		provider.TokenExpiresAt,
	)

	if err != nil {
		return fmt.Errorf("failed to update auth provider: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("auth provider not found")
	}

	return nil
}
