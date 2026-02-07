package storage_test

import (
	"context"
	"testing"
	"time"

	"github.com/food-swipe/internal/auth/adapters/secondary/storage"
	"github.com/food-swipe/internal/auth/core/models"
	testhelpers "github.com/food-swipe/internal/pkg/test"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestOAuthState(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)

	t.Run("Create OAuth state", func(t *testing.T) {
		pool := container.Setup(t)
		createOAuthState(t, pool)
	})

	t.Run("Create OAuth state duplicate state", func(t *testing.T) {
		pool := container.Setup(t)
		createOAuthStateDuplicateState(t, pool)
	})

	t.Run("Get OAuth state by state", func(t *testing.T) {
		pool := container.Setup(t)
		getOAuthStateByState(t, pool)
	})

	t.Run("Delete OAuth state", func(t *testing.T) {
		pool := container.Setup(t)
		deleteOAuthState(t, pool)
	})

	t.Run("Delete expired OAuth states", func(t *testing.T) {
		pool := container.Setup(t)
		deleteExpiredOAuthStates(t, pool)
	})

	t.Run("Delete expired OAuth states no expired", func(t *testing.T) {
		pool := container.Setup(t)
		deleteExpiredOAuthStatesNoExpired(t, pool)
	})

	t.Run("Create OAuth state multiple providers", func(t *testing.T) {
		pool := container.Setup(t)
		createOAuthStateMultipleProviders(t, pool)
	})
}

func createOAuthState(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	stateID, err := uuid.NewV7()
	assert.NoError(err)

	state := &models.OAuthState{
		ID:            stateID,
		State:         "random-state-string",
		CodeVerifier:  "code-verifier-123",
		CodeChallenge: "code-challenge-123",
		Provider:      models.AuthProviderGoogle,
		RedirectURI:   "https://example.com/callback",
		ExpiresAt:     time.Now().Add(10 * time.Minute),
	}

	err = adapter.CreateOAuthState(ctx, state)
	assert.NoError(err)
}

func createOAuthStateDuplicateState(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	stateID1, err := uuid.NewV7()
	assert.NoError(err)

	state1 := &models.OAuthState{
		ID:            stateID1,
		State:         "duplicate-state",
		CodeVerifier:  "code-verifier-1",
		CodeChallenge: "code-challenge-1",
		Provider:      models.AuthProviderGoogle,
		RedirectURI:   "https://example.com/callback",
		ExpiresAt:     time.Now().Add(10 * time.Minute),
	}

	err = adapter.CreateOAuthState(ctx, state1)
	assert.NoError(err)

	stateID2, err := uuid.NewV7()
	assert.NoError(err)

	state2 := &models.OAuthState{
		ID:            stateID2,
		State:         "duplicate-state",
		CodeVerifier:  "code-verifier-2",
		CodeChallenge: "code-challenge-2",
		Provider:      models.AuthProviderGoogle,
		RedirectURI:   "https://example.com/callback",
		ExpiresAt:     time.Now().Add(10 * time.Minute),
	}

	err = adapter.CreateOAuthState(ctx, state2)
	assert.Error(err)
}

func getOAuthStateByState(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	stateID, err := uuid.NewV7()
	assert.NoError(err)

	expiresAt := time.Now().Add(10 * time.Minute).Truncate(time.Microsecond)

	state := &models.OAuthState{
		ID:            stateID,
		State:         "get-state-string",
		CodeVerifier:  "code-verifier-456",
		CodeChallenge: "code-challenge-456",
		Provider:      models.AuthProviderGoogle,
		RedirectURI:   "https://example.com/callback",
		ExpiresAt:     expiresAt,
	}

	err = adapter.CreateOAuthState(ctx, state)
	assert.NoError(err)

	t.Run("should return state when found", func(t *testing.T) {
		result, err := adapter.GetOAuthStateByState(ctx, "get-state-string")
		assert.NoError(err)
		assert.NotNil(result)
		assert.Equal(stateID, result.ID)
		assert.Equal("get-state-string", result.State)
		assert.Equal("code-verifier-456", result.CodeVerifier)
		assert.Equal("code-challenge-456", result.CodeChallenge)
		assert.Equal(models.AuthProviderGoogle, result.Provider)
		assert.Equal("https://example.com/callback", result.RedirectURI)
		assert.WithinDuration(expiresAt, result.ExpiresAt, time.Second)
		assert.False(result.CreatedAt.IsZero())
	})

	t.Run("should return error when state not found", func(t *testing.T) {
		result, err := adapter.GetOAuthStateByState(ctx, "nonexistent-state")
		assert.Error(err)
		assert.Nil(result)
	})
}

func deleteOAuthState(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	stateID, err := uuid.NewV7()
	assert.NoError(err)

	state := &models.OAuthState{
		ID:            stateID,
		State:         "delete-state-string",
		CodeVerifier:  "code-verifier-789",
		CodeChallenge: "code-challenge-789",
		Provider:      models.AuthProviderGoogle,
		RedirectURI:   "https://example.com/callback",
		ExpiresAt:     time.Now().Add(10 * time.Minute),
	}

	err = adapter.CreateOAuthState(ctx, state)
	assert.NoError(err)

	t.Run("should delete state successfully", func(t *testing.T) {
		err := adapter.DeleteOAuthState(ctx, "delete-state-string")
		assert.NoError(err)

		result, err := adapter.GetOAuthStateByState(ctx, "delete-state-string")
		assert.Error(err)
		assert.Nil(result)
	})

	t.Run("should return error when state not found", func(t *testing.T) {
		err := adapter.DeleteOAuthState(ctx, "nonexistent-state")
		assert.Error(err)
	})
}

func deleteExpiredOAuthStates(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	expiredID, err := uuid.NewV7()
	assert.NoError(err)
	expiredState := &models.OAuthState{
		ID:            expiredID,
		State:         "expired-state",
		CodeVerifier:  "code-verifier-expired",
		CodeChallenge: "code-challenge-expired",
		Provider:      models.AuthProviderGoogle,
		RedirectURI:   "https://example.com/callback",
		ExpiresAt:     time.Now().Add(-1 * time.Hour),
	}

	err = adapter.CreateOAuthState(ctx, expiredState)
	assert.NoError(err)

	validID, err := uuid.NewV7()
	assert.NoError(err)
	validState := &models.OAuthState{
		ID:            validID,
		State:         "valid-state",
		CodeVerifier:  "code-verifier-valid",
		CodeChallenge: "code-challenge-valid",
		Provider:      models.AuthProviderGoogle,
		RedirectURI:   "https://example.com/callback",
		ExpiresAt:     time.Now().Add(1 * time.Hour),
	}

	err = adapter.CreateOAuthState(ctx, validState)
	assert.NoError(err)

	err = adapter.DeleteExpiredOAuthStates(ctx)
	assert.NoError(err)

	// Expired state should be deleted
	result, err := adapter.GetOAuthStateByState(ctx, "expired-state")
	assert.Error(err)
	assert.Nil(result)

	// Valid state should still exist
	result, err = adapter.GetOAuthStateByState(ctx, "valid-state")
	assert.NoError(err)
	assert.NotNil(result)
	assert.Equal("valid-state", result.State)
}

func deleteExpiredOAuthStatesNoExpired(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	// Should not error when there are no expired states
	err := adapter.DeleteExpiredOAuthStates(ctx)
	assert.NoError(err)
}

func createOAuthStateMultipleProviders(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	googleID, err := uuid.NewV7()
	assert.NoError(err)
	googleState := &models.OAuthState{
		ID:            googleID,
		State:         "google-state",
		CodeVerifier:  "google-verifier",
		CodeChallenge: "google-challenge",
		Provider:      models.AuthProviderGoogle,
		RedirectURI:   "https://example.com/callback/google",
		ExpiresAt:     time.Now().Add(10 * time.Minute),
	}

	appleID, err := uuid.NewV7()
	assert.NoError(err)
	appleState := &models.OAuthState{
		ID:            appleID,
		State:         "apple-state",
		CodeVerifier:  "apple-verifier",
		CodeChallenge: "apple-challenge",
		Provider:      models.AuthProviderApple,
		RedirectURI:   "https://example.com/callback/apple",
		ExpiresAt:     time.Now().Add(10 * time.Minute),
	}

	err = adapter.CreateOAuthState(ctx, googleState)
	assert.NoError(err)

	err = adapter.CreateOAuthState(ctx, appleState)
	assert.NoError(err)

	googleResult, err := adapter.GetOAuthStateByState(ctx, "google-state")
	assert.NoError(err)
	assert.Equal(models.AuthProviderGoogle, googleResult.Provider)

	appleResult, err := adapter.GetOAuthStateByState(ctx, "apple-state")
	assert.NoError(err)
	assert.Equal(models.AuthProviderApple, appleResult.Provider)
}
