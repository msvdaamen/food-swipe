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

func TestRefreshToken(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)

	t.Run("Create refresh token", func(t *testing.T) {
		pool := container.Setup(t)
		createRefreshToken(t, pool)
	})

	t.Run("Create refresh token minimal fields", func(t *testing.T) {
		pool := container.Setup(t)
		createRefreshTokenMinimalFields(t, pool)
	})

	t.Run("Get refresh token by ID", func(t *testing.T) {
		pool := container.Setup(t)
		getRefreshTokenByID(t, pool)
	})

	t.Run("Get refresh token by ID with nil optional fields", func(t *testing.T) {
		pool := container.Setup(t)
		getRefreshTokenByIDWithNilOptionalFields(t, pool)
	})

	t.Run("Revoke refresh token", func(t *testing.T) {
		pool := container.Setup(t)
		revokeRefreshToken(t, pool)
	})

	t.Run("Revoke refresh token does not affect other tokens", func(t *testing.T) {
		pool := container.Setup(t)
		revokeRefreshTokenDoesNotAffectOtherTokens(t, pool)
	})

	t.Run("Revoke all user refresh tokens", func(t *testing.T) {
		pool := container.Setup(t)
		revokeAllUserRefreshTokens(t, pool)
	})

	t.Run("Revoke all user refresh tokens does not affect other users", func(t *testing.T) {
		pool := container.Setup(t)
		revokeAllUserRefreshTokensDoesNotAffectOtherUsers(t, pool)
	})

	t.Run("Revoke all user refresh tokens skips already revoked", func(t *testing.T) {
		pool := container.Setup(t)
		revokeAllUserRefreshTokensSkipsAlreadyRevoked(t, pool)
	})

	t.Run("Revoke all user refresh tokens no tokens", func(t *testing.T) {
		pool := container.Setup(t)
		revokeAllUserRefreshTokensNoTokens(t, pool)
	})

	t.Run("Delete expired refresh tokens", func(t *testing.T) {
		pool := container.Setup(t)
		deleteExpiredRefreshTokens(t, pool)
	})

	t.Run("Delete expired refresh tokens no expired", func(t *testing.T) {
		pool := container.Setup(t)
		deleteExpiredRefreshTokensNoExpired(t, pool)
	})

	t.Run("Delete expired refresh tokens multiple users", func(t *testing.T) {
		pool := container.Setup(t)
		deleteExpiredRefreshTokensMultipleUsers(t, pool)
	})

	t.Run("Multiple refresh tokens per user", func(t *testing.T) {
		pool := container.Setup(t)
		multipleRefreshTokensPerUser(t, pool)
	})
}

func createRefreshToken(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	tokenID, err := uuid.NewV7()
	assert.NoError(err)

	token := &models.RefreshToken{
		ID:         tokenID,
		UserID:     userID,
		ExpiresAt:  time.Now().Add(7 * 24 * time.Hour),
		DeviceInfo: stringPtr("Mozilla/5.0 Test Browser"),
		IPAddress:  stringPtr("192.168.1.1"),
	}

	err = adapter.CreateRefreshToken(ctx, token)
	assert.NoError(err)
}

func createRefreshTokenMinimalFields(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	tokenID, err := uuid.NewV7()
	assert.NoError(err)

	token := &models.RefreshToken{
		ID:        tokenID,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	err = adapter.CreateRefreshToken(ctx, token)
	assert.NoError(err)
}

func getRefreshTokenByID(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	tokenID, err := uuid.NewV7()
	assert.NoError(err)

	expiresAt := time.Now().Add(7 * 24 * time.Hour).Truncate(time.Microsecond)

	token := &models.RefreshToken{
		ID:         tokenID,
		UserID:     userID,
		ExpiresAt:  expiresAt,
		DeviceInfo: stringPtr("Test Device"),
		IPAddress:  stringPtr("10.0.0.1"),
	}

	err = adapter.CreateRefreshToken(ctx, token)
	assert.NoError(err)

	t.Run("should return token when found", func(t *testing.T) {
		result, err := adapter.GetRefreshTokenByID(ctx, tokenID)
		assert.NoError(err)
		assert.NotNil(result)
		assert.Equal(tokenID, result.ID)
		assert.Equal(userID, result.UserID)
		assert.WithinDuration(expiresAt.UTC(), result.ExpiresAt, time.Second)
		assert.Nil(result.RevokedAt)
		assert.Equal("Test Device", *result.DeviceInfo)
		assert.Equal("10.0.0.1", *result.IPAddress)
		assert.False(result.CreatedAt.IsZero())
	})

	t.Run("should return error when token not found", func(t *testing.T) {
		result, err := adapter.GetRefreshTokenByID(ctx, uuid.New())
		assert.Error(err)
		assert.Nil(result)
	})
}

func getRefreshTokenByIDWithNilOptionalFields(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	tokenID, err := uuid.NewV7()
	assert.NoError(err)

	token := &models.RefreshToken{
		ID:        tokenID,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	err = adapter.CreateRefreshToken(ctx, token)
	assert.NoError(err)

	result, err := adapter.GetRefreshTokenByID(ctx, tokenID)
	assert.NoError(err)
	assert.NotNil(result)
	assert.Nil(result.DeviceInfo)
	assert.Nil(result.IPAddress)
	assert.Nil(result.RevokedAt)
}

func revokeRefreshToken(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	tokenID, err := uuid.NewV7()
	assert.NoError(err)

	token := &models.RefreshToken{
		ID:        tokenID,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	err = adapter.CreateRefreshToken(ctx, token)
	assert.NoError(err)

	t.Run("should revoke token successfully", func(t *testing.T) {
		err := adapter.RevokeRefreshToken(ctx, tokenID)
		assert.NoError(err)

		result, err := adapter.GetRefreshTokenByID(ctx, tokenID)
		assert.NoError(err)
		assert.NotNil(result)
		assert.NotNil(result.RevokedAt)
	})

	t.Run("should return error when token not found", func(t *testing.T) {
		err := adapter.RevokeRefreshToken(ctx, uuid.New())
		assert.Error(err)
	})
}

func revokeRefreshTokenDoesNotAffectOtherTokens(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	tokenID1, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        tokenID1,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	assert.NoError(err)

	tokenID2, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        tokenID2,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	assert.NoError(err)

	err = adapter.RevokeRefreshToken(ctx, tokenID1)
	assert.NoError(err)

	// First token should be revoked
	result1, err := adapter.GetRefreshTokenByID(ctx, tokenID1)
	assert.NoError(err)
	assert.NotNil(result1.RevokedAt)

	// Second token should remain unrevoked
	result2, err := adapter.GetRefreshTokenByID(ctx, tokenID2)
	assert.NoError(err)
	assert.Nil(result2.RevokedAt)
}

func revokeAllUserRefreshTokens(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	tokenID1, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        tokenID1,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	assert.NoError(err)

	tokenID2, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        tokenID2,
		UserID:    userID,
		ExpiresAt: time.Now().Add(14 * 24 * time.Hour),
	})
	assert.NoError(err)

	err = adapter.RevokeAllUserRefreshTokens(ctx, userID)
	assert.NoError(err)

	result1, err := adapter.GetRefreshTokenByID(ctx, tokenID1)
	assert.NoError(err)
	assert.NotNil(result1.RevokedAt)

	result2, err := adapter.GetRefreshTokenByID(ctx, tokenID2)
	assert.NoError(err)
	assert.NotNil(result2.RevokedAt)
}

func revokeAllUserRefreshTokensDoesNotAffectOtherUsers(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID1 := uuid.New()
	userID2 := uuid.New()

	tokenID1, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        tokenID1,
		UserID:    userID1,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	assert.NoError(err)

	tokenID2, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        tokenID2,
		UserID:    userID2,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	assert.NoError(err)

	err = adapter.RevokeAllUserRefreshTokens(ctx, userID1)
	assert.NoError(err)

	// User1's token should be revoked
	result1, err := adapter.GetRefreshTokenByID(ctx, tokenID1)
	assert.NoError(err)
	assert.NotNil(result1.RevokedAt)

	// User2's token should remain unrevoked
	result2, err := adapter.GetRefreshTokenByID(ctx, tokenID2)
	assert.NoError(err)
	assert.Nil(result2.RevokedAt)
}

func revokeAllUserRefreshTokensSkipsAlreadyRevoked(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	tokenID1, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        tokenID1,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	assert.NoError(err)

	// Revoke the first token individually
	err = adapter.RevokeRefreshToken(ctx, tokenID1)
	assert.NoError(err)

	result1Before, err := adapter.GetRefreshTokenByID(ctx, tokenID1)
	assert.NoError(err)
	firstRevokedAt := result1Before.RevokedAt

	tokenID2, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        tokenID2,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	assert.NoError(err)

	// Small delay to ensure timestamps differ
	time.Sleep(10 * time.Millisecond)

	// Revoke all — should only affect unrevoked tokens
	err = adapter.RevokeAllUserRefreshTokens(ctx, userID)
	assert.NoError(err)

	// Already-revoked token should keep its original revoked_at timestamp
	result1After, err := adapter.GetRefreshTokenByID(ctx, tokenID1)
	assert.NoError(err)
	assert.NotNil(result1After.RevokedAt)
	assert.WithinDuration(*firstRevokedAt, *result1After.RevokedAt, time.Millisecond)

	// Second token should now be revoked
	result2, err := adapter.GetRefreshTokenByID(ctx, tokenID2)
	assert.NoError(err)
	assert.NotNil(result2.RevokedAt)
}

func revokeAllUserRefreshTokensNoTokens(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	// Should not error when user has no tokens
	err := adapter.RevokeAllUserRefreshTokens(ctx, userID)
	assert.NoError(err)
}

func deleteExpiredRefreshTokens(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	// Create an expired token
	expiredID, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        expiredID,
		UserID:    userID,
		ExpiresAt: time.Now().Add(-1 * time.Hour),
	})
	assert.NoError(err)

	// Create a valid token
	validID, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        validID,
		UserID:    userID,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	assert.NoError(err)

	err = adapter.DeleteExpiredRefreshTokens(ctx)
	assert.NoError(err)

	// Expired token should be deleted
	result, err := adapter.GetRefreshTokenByID(ctx, expiredID)
	assert.Error(err)
	assert.Nil(result)

	// Valid token should still exist
	result, err = adapter.GetRefreshTokenByID(ctx, validID)
	assert.NoError(err)
	assert.NotNil(result)
	assert.Equal(validID, result.ID)
}

func deleteExpiredRefreshTokensNoExpired(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	// Should not error when there are no expired tokens
	err := adapter.DeleteExpiredRefreshTokens(ctx)
	assert.NoError(err)
}

func deleteExpiredRefreshTokensMultipleUsers(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID1 := uuid.New()
	userID2 := uuid.New()

	// Expired token for user 1
	expiredID1, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        expiredID1,
		UserID:    userID1,
		ExpiresAt: time.Now().Add(-2 * time.Hour),
	})
	assert.NoError(err)

	// Valid token for user 1
	validID1, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        validID1,
		UserID:    userID1,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	})
	assert.NoError(err)

	// Expired token for user 2
	expiredID2, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        expiredID2,
		UserID:    userID2,
		ExpiresAt: time.Now().Add(-30 * time.Minute),
	})
	assert.NoError(err)

	// Valid token for user 2
	validID2, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:        validID2,
		UserID:    userID2,
		ExpiresAt: time.Now().Add(14 * 24 * time.Hour),
	})
	assert.NoError(err)

	err = adapter.DeleteExpiredRefreshTokens(ctx)
	assert.NoError(err)

	// Both expired tokens should be deleted
	result, err := adapter.GetRefreshTokenByID(ctx, expiredID1)
	assert.Error(err)
	assert.Nil(result)

	result, err = adapter.GetRefreshTokenByID(ctx, expiredID2)
	assert.Error(err)
	assert.Nil(result)

	// Both valid tokens should still exist
	result, err = adapter.GetRefreshTokenByID(ctx, validID1)
	assert.NoError(err)
	assert.NotNil(result)

	result, err = adapter.GetRefreshTokenByID(ctx, validID2)
	assert.NoError(err)
	assert.NotNil(result)
}

func multipleRefreshTokensPerUser(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	tokenID1, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:         tokenID1,
		UserID:     userID,
		ExpiresAt:  time.Now().Add(7 * 24 * time.Hour),
		DeviceInfo: stringPtr("Device A"),
		IPAddress:  stringPtr("10.0.0.1"),
	})
	assert.NoError(err)

	tokenID2, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateRefreshToken(ctx, &models.RefreshToken{
		ID:         tokenID2,
		UserID:     userID,
		ExpiresAt:  time.Now().Add(14 * 24 * time.Hour),
		DeviceInfo: stringPtr("Device B"),
		IPAddress:  stringPtr("10.0.0.2"),
	})
	assert.NoError(err)

	result1, err := adapter.GetRefreshTokenByID(ctx, tokenID1)
	assert.NoError(err)
	assert.NotNil(result1)
	assert.Equal("Device A", *result1.DeviceInfo)
	assert.Equal("10.0.0.1", *result1.IPAddress)

	result2, err := adapter.GetRefreshTokenByID(ctx, tokenID2)
	assert.NoError(err)
	assert.NotNil(result2)
	assert.Equal("Device B", *result2.DeviceInfo)
	assert.Equal("10.0.0.2", *result2.IPAddress)
}
