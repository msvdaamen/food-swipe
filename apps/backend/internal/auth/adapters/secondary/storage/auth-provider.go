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

const insertAuthProviderQuery = `
	INSERT INTO user_auth_providers (id, user_id, provider, provider_user_id, password, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`

const getAuthProviderByProviderUserIDQuery = `
	SELECT id, user_id, provider, provider_user_id, password, created_at, updated_at
	FROM user_auth_providers
	WHERE provider_user_id = $1 AND provider = $2
`
const getAuthProviderByUserIDQuery = `
	SELECT id, user_id, provider, provider_user_id, password, created_at, updated_at
	FROM user_auth_providers
	WHERE user_id = $1 AND provider = $2
`
const getAuthProvidersByUserIDQuery = `
	SELECT id, user_id, provider, provider_user_id, password, created_at, updated_at
	FROM user_auth_providers
	WHERE user_id = $1
`
const updateAuthProviderQuery = `
	UPDATE user_auth_providers
	SET user_id = $2, provider = $3, provider_user_id = $4, password = $5, updated_at = $7
	WHERE id = $1
`

// CreateUserAuthProvider creates a new auth provider link in the database
func (a *Adapter) CreateUserAuthProvider(ctx context.Context, provider *models.UserAuthProvider) error {
	now := time.Now()
	_, err := a.db.Exec(ctx, insertAuthProviderQuery,
		provider.ID,
		provider.UserID,
		provider.Provider,
		provider.ProviderUserID,
		provider.Password,
		now,
		now,
	)

	if err != nil {
		return fmt.Errorf("failed to create auth provider: %w", err)
	}

	return nil
}

// GetUserAuthProviderByProviderUserID retrieves an auth provider by provider name and provider user ID
func (a *Adapter) GetUserAuthProviderByProviderUserID(ctx context.Context, provider models.AuthProvider, providerUserID string) (*models.UserAuthProvider, error) {

	authProvider := &models.UserAuthProvider{}
	err := a.db.QueryRow(ctx, getAuthProviderByProviderUserIDQuery, providerUserID, provider).Scan(
		&authProvider.ID,
		&authProvider.UserID,
		&authProvider.Provider,
		&authProvider.ProviderUserID,
		&authProvider.Password,
		&authProvider.CreatedAt,
		&authProvider.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrUserProviderNotFound
		}
		return nil, fmt.Errorf("failed to get auth provider: %w", err)
	}

	return authProvider, nil
}

// GetUserAuthProviderByUserID retrieves an auth provider by provider name and user ID
func (a *Adapter) GetUserAuthProviderByUserID(ctx context.Context, provider models.AuthProvider, userID uuid.UUID) (*models.UserAuthProvider, error) {

	authProvider := &models.UserAuthProvider{}
	err := a.db.QueryRow(ctx, getAuthProviderByUserIDQuery, userID, provider).Scan(
		&authProvider.ID,
		&authProvider.UserID,
		&authProvider.Provider,
		&authProvider.ProviderUserID,
		&authProvider.Password,
		&authProvider.CreatedAt,
		&authProvider.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, models.ErrUserProviderNotFound
		}
		return nil, fmt.Errorf("failed to get auth provider: %w", err)
	}

	return authProvider, nil
}

// GetUserAuthProvidersByUserID retrieves all auth providers for a user
func (a *Adapter) GetUserAuthProvidersByUserID(ctx context.Context, userID uuid.UUID) ([]*models.UserAuthProvider, error) {
	rows, err := a.db.Query(ctx, getAuthProvidersByUserIDQuery, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get auth providers: %w", err)
	}
	defer rows.Close()

	var providers []*models.UserAuthProvider
	for rows.Next() {
		provider := &models.UserAuthProvider{}
		err := rows.Scan(
			&provider.ID,
			&provider.UserID,
			&provider.Provider,
			&provider.ProviderUserID,
			&provider.Password,
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

func (a *Adapter) UpdateUserAuthProvider(ctx context.Context, providerID uuid.UUID, provider *models.UserAuthProvider) error {
	payload := []any{
		provider.ID,
		provider.UserID,
		provider.Provider,
		provider.ProviderUserID,
		provider.Password,
		time.Now(),
	}

	_, err := a.db.Exec(ctx, updateAuthProviderQuery, payload...)
	if err != nil {
		return fmt.Errorf("failed to update auth provider: %w", err)
	}

	return nil
}
