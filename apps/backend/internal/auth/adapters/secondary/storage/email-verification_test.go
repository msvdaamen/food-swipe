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

func TestEmailVerification(t *testing.T) {
	t.Parallel()

	container := testhelpers.SetupTestDatabase(t)

	t.Run("Create email verification token", func(t *testing.T) {
		pool := container.Setup(t)
		createEmailVerificationToken(t, pool)
	})

	t.Run("Create email verification token duplicate token", func(t *testing.T) {
		pool := container.Setup(t)
		createEmailVerificationTokenDuplicateToken(t, pool)
	})

	t.Run("Get email verification token", func(t *testing.T) {
		pool := container.Setup(t)
		getEmailVerificationToken(t, pool)
	})

	t.Run("Get email verification token after marked used", func(t *testing.T) {
		pool := container.Setup(t)
		getEmailVerificationTokenAfterMarkedUsed(t, pool)
	})

	t.Run("Mark email verification token as used", func(t *testing.T) {
		pool := container.Setup(t)
		markEmailVerificationTokenAsUsed(t, pool)
	})

	t.Run("Mark email verification token as used idempotent", func(t *testing.T) {
		pool := container.Setup(t)
		markEmailVerificationTokenAsUsedIdempotent(t, pool)
	})

	t.Run("Multiple email verification tokens per user", func(t *testing.T) {
		pool := container.Setup(t)
		multipleEmailVerificationTokensPerUser(t, pool)
	})

}

func createEmailVerificationToken(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(24 * time.Hour)

	err := adapter.CreateEmailVerificationToken(ctx, userID, "verification-token-123", expiresAt)
	assert.NoError(err)
}

func createEmailVerificationTokenDuplicateToken(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(24 * time.Hour)

	err := adapter.CreateEmailVerificationToken(ctx, userID, "duplicate-token", expiresAt)
	assert.NoError(err)

	err = adapter.CreateEmailVerificationToken(ctx, userID, "duplicate-token", expiresAt)
	assert.Error(err)
}

func getEmailVerificationToken(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(24 * time.Hour)

	err := adapter.CreateEmailVerificationToken(ctx, userID, "get-token-123", expiresAt)
	assert.NoError(err)

	t.Run("should return token when found", func(t *testing.T) {
		returnedUserID, returnedExpiresAt, used, err := adapter.GetEmailVerificationToken(ctx, "get-token-123")
		assert.NoError(err)
		assert.Equal(userID, returnedUserID)
		assert.WithinDuration(expiresAt, returnedExpiresAt, time.Second)
		assert.False(used)
	})

	t.Run("should return error when token not found", func(t *testing.T) {
		_, _, _, err := adapter.GetEmailVerificationToken(ctx, "nonexistent-token")
		assert.Error(err)
	})
}

func getEmailVerificationTokenAfterMarkedUsed(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(24 * time.Hour)

	err := adapter.CreateEmailVerificationToken(ctx, userID, "used-token-123", expiresAt)
	assert.NoError(err)

	err = adapter.MarkEmailVerificationTokenAsUsed(ctx, "used-token-123")
	assert.NoError(err)

	returnedUserID, _, used, err := adapter.GetEmailVerificationToken(ctx, "used-token-123")
	assert.NoError(err)
	assert.Equal(userID, returnedUserID)
	assert.True(used)
}

func markEmailVerificationTokenAsUsed(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(24 * time.Hour)

	err := adapter.CreateEmailVerificationToken(ctx, userID, "mark-used-token", expiresAt)
	assert.NoError(err)

	t.Run("should mark token as used", func(t *testing.T) {
		err := adapter.MarkEmailVerificationTokenAsUsed(ctx, "mark-used-token")
		assert.NoError(err)

		_, _, used, err := adapter.GetEmailVerificationToken(ctx, "mark-used-token")
		assert.NoError(err)
		assert.True(used)
	})

	t.Run("should return error when token not found", func(t *testing.T) {
		err := adapter.MarkEmailVerificationTokenAsUsed(ctx, "nonexistent-token")
		assert.Error(err)
	})
}

func markEmailVerificationTokenAsUsedIdempotent(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(24 * time.Hour)

	err := adapter.CreateEmailVerificationToken(ctx, userID, "idempotent-token", expiresAt)
	assert.NoError(err)

	err = adapter.MarkEmailVerificationTokenAsUsed(ctx, "idempotent-token")
	assert.NoError(err)

	err = adapter.MarkEmailVerificationTokenAsUsed(ctx, "idempotent-token")
	assert.NoError(err)

	_, _, used, err := adapter.GetEmailVerificationToken(ctx, "idempotent-token")
	assert.NoError(err)
	assert.True(used)
}

func multipleEmailVerificationTokensPerUser(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	expiresAt := time.Now().Add(24 * time.Hour)

	err := adapter.CreateEmailVerificationToken(ctx, userID, "token-1", expiresAt)
	assert.NoError(err)

	err = adapter.CreateEmailVerificationToken(ctx, userID, "token-2", expiresAt)
	assert.NoError(err)

	returnedUserID1, _, _, err := adapter.GetEmailVerificationToken(ctx, "token-1")
	assert.NoError(err)
	assert.Equal(userID, returnedUserID1)

	returnedUserID2, _, _, err := adapter.GetEmailVerificationToken(ctx, "token-2")
	assert.NoError(err)
	assert.Equal(userID, returnedUserID2)
}
