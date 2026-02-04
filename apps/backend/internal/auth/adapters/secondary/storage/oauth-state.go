package storage

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/jackc/pgx/v5"
)

// CreateOAuthState creates a new OAuth state in the database
func (a *Adapter) CreateOAuthState(ctx context.Context, state *models.OAuthState) error {
	query := `
		INSERT INTO oauth_states (id, state, code_verifier, code_challenge, provider, redirect_uri, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	_, err := a.db.Exec(ctx, query,
		state.ID,
		state.State,
		state.CodeVerifier,
		state.CodeChallenge,
		state.Provider,
		state.RedirectURI,
		state.ExpiresAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create oauth state: %w", err)
	}

	return nil
}

// GetOAuthStateByState retrieves an OAuth state by its state string
func (a *Adapter) GetOAuthStateByState(ctx context.Context, state string) (*models.OAuthState, error) {
	query := `
		SELECT id, state, code_verifier, code_challenge, provider, redirect_uri, expires_at, created_at
		FROM oauth_states
		WHERE state = $1
	`

	oauthState := &models.OAuthState{}
	err := a.db.QueryRow(ctx, query, state).Scan(
		&oauthState.ID,
		&oauthState.State,
		&oauthState.CodeVerifier,
		&oauthState.CodeChallenge,
		&oauthState.Provider,
		&oauthState.RedirectURI,
		&oauthState.ExpiresAt,
		&oauthState.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("oauth state not found")
		}
		return nil, fmt.Errorf("failed to get oauth state: %w", err)
	}

	return oauthState, nil
}

// DeleteOAuthState deletes an OAuth state from the database
func (a *Adapter) DeleteOAuthState(ctx context.Context, state string) error {
	query := `DELETE FROM oauth_states WHERE state = $1`

	result, err := a.db.Exec(ctx, query, state)
	if err != nil {
		return fmt.Errorf("failed to delete oauth state: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("oauth state not found")
	}

	return nil
}

// DeleteExpiredOAuthStates removes all expired OAuth states from the database
func (a *Adapter) DeleteExpiredOAuthStates(ctx context.Context) error {
	query := `DELETE FROM oauth_states WHERE expires_at < $1`

	_, err := a.db.Exec(ctx, query, time.Now())
	if err != nil {
		return fmt.Errorf("failed to delete expired oauth states: %w", err)
	}

	return nil
}
