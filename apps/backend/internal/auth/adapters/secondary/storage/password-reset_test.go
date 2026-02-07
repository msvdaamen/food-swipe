package storage_test

import (
	"context"
	"testing"
	"time"

	"github.com/food-swipe/internal/auth/adapters/secondary/storage"
	testhelpers "github.com/food-swipe/internal/pkg/test"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestPasswordReset(t *testing.T) {
	t.Parallel()

	container := testhelpers.SetupTestDatabase(t)

	t.Run("Create password reset token", func(t *testing.T) {
		pool := container.Setup(t)
		createPasswordResetToken(t, pool)
	})

	t.Run("Create password reset token duplicate token", func(t *testing.T) {
		pool := container.Setup(t)
		createPasswordResetTokenDuplicateToken(t, pool)
	})

	t.Run("Get password reset token", func(t *testing.T) {
		pool := container.Setup(t)
		getPasswordResetToken(t, pool)
	})

	t.Run("Get password reset token after marked used", func(t *testing.T) {
		pool := container.Setup(t)
		getPasswordResetTokenAfterMarkedUsed(t, pool)
	})

	t.Run("Mark password reset token as used", func(t *testing.T) {
		pool := container.Setup(t)
		markPasswordResetTokenAsUsed(t, pool)
	})

	t.Run("Mark password reset token as used idempotent", func(t *testing.T) {
		pool := container.Setup(t)
		markPasswordResetTokenAsUsedIdempotent(t, pool)
	})

	t.Run("Multiple password reset tokens per user", func(t *testing.T) {
		pool := container.Setup(t)
		multiplePasswordResetTokensPerUser(t, pool)
	})

	t.Run("Mark password reset token as used does not affect other tokens", func(t *testing.T) {
		pool := container.Setup(t)
		markPasswordResetTokenAsUsedDoesNotAffectOtherTokens(t, pool)
	})

	t.Run("Password reset token with expired time", func(t *testing.T) {
		pool := container.Setup(t)
		passwordResetTokenWithExpiredTime(t, pool)
	})

}

func createPasswordResetToken(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(1 * time.Hour).Truncate(time.Microsecond)

	err := adapter.CreatePasswordResetToken(ctx, userID, "reset-token-123", expiresAt)
	assert.NoError(err)
}

func createPasswordResetTokenDuplicateToken(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(1 * time.Hour)

	err := adapter.CreatePasswordResetToken(ctx, userID, "duplicate-reset-token", expiresAt)
	assert.NoError(err)

	err = adapter.CreatePasswordResetToken(ctx, userID, "duplicate-reset-token", expiresAt)
	assert.Error(err)
}

func getPasswordResetToken(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(1 * time.Hour).Truncate(time.Microsecond)

	err := adapter.CreatePasswordResetToken(ctx, userID, "get-reset-token", expiresAt)
	assert.NoError(err)

	t.Run("should return token when found", func(t *testing.T) {
		returnedUserID, returnedExpiresAt, used, err := adapter.GetPasswordResetToken(ctx, "get-reset-token")
		assert.NoError(err)
		assert.Equal(userID, returnedUserID)
		assert.WithinDuration(expiresAt, returnedExpiresAt, time.Second)
		assert.False(used)
	})

	t.Run("should return error when token not found", func(t *testing.T) {
		returnedUserID, returnedExpiresAt, used, err := adapter.GetPasswordResetToken(ctx, "nonexistent-reset-token")
		assert.Error(err)
		assert.Equal(uuid.Nil, returnedUserID)
		assert.True(returnedExpiresAt.IsZero())
		assert.False(used)
	})
}

func getPasswordResetTokenAfterMarkedUsed(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(1 * time.Hour).Truncate(time.Microsecond)

	err := adapter.CreatePasswordResetToken(ctx, userID, "used-reset-token", expiresAt)
	assert.NoError(err)

	err = adapter.MarkPasswordResetTokenAsUsed(ctx, "used-reset-token")
	assert.NoError(err)

	returnedUserID, _, used, err := adapter.GetPasswordResetToken(ctx, "used-reset-token")
	assert.NoError(err)
	assert.Equal(userID, returnedUserID)
	assert.True(used)
}

func markPasswordResetTokenAsUsed(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(1 * time.Hour)

	err := adapter.CreatePasswordResetToken(ctx, userID, "mark-reset-token", expiresAt)
	assert.NoError(err)

	t.Run("should mark token as used", func(t *testing.T) {
		err := adapter.MarkPasswordResetTokenAsUsed(ctx, "mark-reset-token")
		assert.NoError(err)

		_, _, used, err := adapter.GetPasswordResetToken(ctx, "mark-reset-token")
		assert.NoError(err)
		assert.True(used)
	})

	t.Run("should return error when token not found", func(t *testing.T) {
		err := adapter.MarkPasswordResetTokenAsUsed(ctx, "nonexistent-reset-token")
		assert.Error(err)
	})
}

func markPasswordResetTokenAsUsedIdempotent(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(1 * time.Hour)

	err := adapter.CreatePasswordResetToken(ctx, userID, "idempotent-reset-token", expiresAt)
	assert.NoError(err)

	err = adapter.MarkPasswordResetTokenAsUsed(ctx, "idempotent-reset-token")
	assert.NoError(err)

	// Marking as used again should still succeed
	err = adapter.MarkPasswordResetTokenAsUsed(ctx, "idempotent-reset-token")
	assert.NoError(err)

	_, _, used, err := adapter.GetPasswordResetToken(ctx, "idempotent-reset-token")
	assert.NoError(err)
	assert.True(used)
}

func multiplePasswordResetTokensPerUser(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(1 * time.Hour)

	err := adapter.CreatePasswordResetToken(ctx, userID, "reset-token-1", expiresAt)
	assert.NoError(err)

	err = adapter.CreatePasswordResetToken(ctx, userID, "reset-token-2", expiresAt)
	assert.NoError(err)

	// Both tokens should be independently retrievable
	returnedUserID1, _, _, err := adapter.GetPasswordResetToken(ctx, "reset-token-1")
	assert.NoError(err)
	assert.Equal(userID, returnedUserID1)

	returnedUserID2, _, _, err := adapter.GetPasswordResetToken(ctx, "reset-token-2")
	assert.NoError(err)
	assert.Equal(userID, returnedUserID2)
}

func markPasswordResetTokenAsUsedDoesNotAffectOtherTokens(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(1 * time.Hour)

	err := adapter.CreatePasswordResetToken(ctx, userID, "reset-independent-1", expiresAt)
	assert.NoError(err)

	err = adapter.CreatePasswordResetToken(ctx, userID, "reset-independent-2", expiresAt)
	assert.NoError(err)

	// Mark only the first token as used
	err = adapter.MarkPasswordResetTokenAsUsed(ctx, "reset-independent-1")
	assert.NoError(err)

	// First token should be used
	_, _, used1, err := adapter.GetPasswordResetToken(ctx, "reset-independent-1")
	assert.NoError(err)
	assert.True(used1)

	// Second token should still be unused
	_, _, used2, err := adapter.GetPasswordResetToken(ctx, "reset-independent-2")
	assert.NoError(err)
	assert.False(used2)
}

func passwordResetTokenWithExpiredTime(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	// Create a token that is already expired
	expiresAt := time.Now().Add(-1 * time.Hour).Truncate(time.Microsecond)

	err := adapter.CreatePasswordResetToken(ctx, userID, "expired-reset-token", expiresAt)
	assert.NoError(err)

	// Should still be retrievable (expiry check is business logic, not storage)
	returnedUserID, returnedExpiresAt, used, err := adapter.GetPasswordResetToken(ctx, "expired-reset-token")
	assert.NoError(err)
	assert.Equal(userID, returnedUserID)
	assert.WithinDuration(expiresAt, returnedExpiresAt, time.Second)
	assert.False(used)
}
