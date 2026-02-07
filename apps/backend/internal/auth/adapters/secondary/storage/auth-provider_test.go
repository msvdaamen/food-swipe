package storage_test

import (
	"context"
	"testing"

	"github.com/food-swipe/internal/auth/adapters/secondary/storage"
	"github.com/food-swipe/internal/auth/core/models"
	testhelpers "github.com/food-swipe/internal/pkg/test"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestAuthProvider(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)

	t.Run("Create user auth provider", func(t *testing.T) {
		pool := container.Setup(t)
		createUserAuthProvider(t, pool)
	})

	t.Run("Create user auth provider duplicate provider user id", func(t *testing.T) {
		pool := container.Setup(t)
		createUserAuthProviderDuplicateProviderUserID(t, pool)
	})

	t.Run("Get user auth provider by provider user id", func(t *testing.T) {
		pool := container.Setup(t)
		getUserAuthProviderByProviderUserID(t, pool)
	})

	t.Run("Get user auth provider by user id", func(t *testing.T) {
		pool := container.Setup(t)
		getUserAuthProviderByUserID(t, pool)
	})

	t.Run("Get user auth providers by user id", func(t *testing.T) {
		pool := container.Setup(t)
		getUserAuthProvidersByUserID(t, pool)
	})

	t.Run("Update user auth provider", func(t *testing.T) {
		pool := container.Setup(t)
		updateUserAuthProvider(t, pool)
	})

}

func createUserAuthProvider(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	providerID, err := uuid.NewV7()
	assert.NoError(err)

	provider := &models.UserAuthProvider{
		ID:             providerID,
		UserID:         userID,
		Provider:       models.AuthProviderPassword,
		ProviderUserID: "test@test.com",
		Password:       stringPtr("hashedpassword123"),
	}

	err = adapter.CreateUserAuthProvider(ctx, provider)
	assert.NoError(err)
}

func createUserAuthProviderDuplicateProviderUserID(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	providerID1, err := uuid.NewV7()
	assert.NoError(err)

	provider1 := &models.UserAuthProvider{
		ID:             providerID1,
		UserID:         userID,
		Provider:       models.AuthProviderPassword,
		ProviderUserID: "duplicate@test.com",
		Password:       stringPtr("hashedpassword123"),
	}

	err = adapter.CreateUserAuthProvider(ctx, provider1)
	assert.NoError(err)

	providerID2, err := uuid.NewV7()
	assert.NoError(err)

	userID2 := uuid.New()
	provider2 := &models.UserAuthProvider{
		ID:             providerID2,
		UserID:         userID2,
		Provider:       models.AuthProviderPassword,
		ProviderUserID: "duplicate@test.com",
		Password:       stringPtr("hashedpassword456"),
	}

	err = adapter.CreateUserAuthProvider(ctx, provider2)
	assert.Error(err)
}

func getUserAuthProviderByProviderUserID(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	providerID, err := uuid.NewV7()
	assert.NoError(err)

	provider := &models.UserAuthProvider{
		ID:             providerID,
		UserID:         userID,
		Provider:       models.AuthProviderPassword,
		ProviderUserID: "test@test.com",
		Password:       stringPtr("hashedpassword123"),
	}

	err = adapter.CreateUserAuthProvider(ctx, provider)
	assert.NoError(err)

	t.Run("should return provider when found", func(t *testing.T) {
		result, err := adapter.GetUserAuthProviderByProviderUserID(ctx, models.AuthProviderPassword, "test@test.com")
		assert.NoError(err)
		assert.NotNil(result)
		assert.Equal(providerID, result.ID)
		assert.Equal(userID, result.UserID)
		assert.Equal(models.AuthProviderPassword, result.Provider)
		assert.Equal("test@test.com", result.ProviderUserID)
		assert.Equal("hashedpassword123", *result.Password)
		assert.False(result.CreatedAt.IsZero())
		assert.False(result.UpdatedAt.IsZero())
	})

	t.Run("should return error when provider user ID not found", func(t *testing.T) {
		result, err := adapter.GetUserAuthProviderByProviderUserID(ctx, models.AuthProviderPassword, "nonexistent@test.com")
		assert.ErrorIs(err, models.ErrUserProviderNotFound)
		assert.Nil(result)
	})

	t.Run("should return error when provider type does not match", func(t *testing.T) {
		result, err := adapter.GetUserAuthProviderByProviderUserID(ctx, models.AuthProviderGoogle, "test@test.com")
		assert.ErrorIs(err, models.ErrUserProviderNotFound)
		assert.Nil(result)
	})
}

func getUserAuthProviderByUserID(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	providerID, err := uuid.NewV7()
	assert.NoError(err)

	provider := &models.UserAuthProvider{
		ID:             providerID,
		UserID:         userID,
		Provider:       models.AuthProviderPassword,
		ProviderUserID: "test@test.com",
		Password:       stringPtr("hashedpassword123"),
	}

	err = adapter.CreateUserAuthProvider(ctx, provider)
	assert.NoError(err)

	t.Run("should return provider when found", func(t *testing.T) {
		result, err := adapter.GetUserAuthProviderByUserID(ctx, models.AuthProviderPassword, userID)
		assert.NoError(err)
		assert.NotNil(result)
		assert.Equal(providerID, result.ID)
		assert.Equal(userID, result.UserID)
		assert.Equal(models.AuthProviderPassword, result.Provider)
		assert.Equal("test@test.com", result.ProviderUserID)
		assert.Equal("hashedpassword123", *result.Password)
	})

	t.Run("should return error when user ID not found", func(t *testing.T) {
		result, err := adapter.GetUserAuthProviderByUserID(ctx, models.AuthProviderPassword, uuid.New())
		assert.ErrorIs(err, models.ErrUserProviderNotFound)
		assert.Nil(result)
	})

	t.Run("should return error when provider type does not match", func(t *testing.T) {
		result, err := adapter.GetUserAuthProviderByUserID(ctx, models.AuthProviderGoogle, userID)
		assert.ErrorIs(err, models.ErrUserProviderNotFound)
		assert.Nil(result)
	})
}

func getUserAuthProvidersByUserID(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	t.Run("should return empty list when no providers exist", func(t *testing.T) {
		providers, err := adapter.GetUserAuthProvidersByUserID(ctx, userID)
		assert.NoError(err)
		assert.Empty(providers)
	})

	providerID1, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateUserAuthProvider(ctx, &models.UserAuthProvider{
		ID:             providerID1,
		UserID:         userID,
		Provider:       models.AuthProviderPassword,
		ProviderUserID: "test@test.com",
		Password:       stringPtr("hashedpassword123"),
	})
	assert.NoError(err)

	providerID2, err := uuid.NewV7()
	assert.NoError(err)
	err = adapter.CreateUserAuthProvider(ctx, &models.UserAuthProvider{
		ID:             providerID2,
		UserID:         userID,
		Provider:       models.AuthProviderGoogle,
		ProviderUserID: "google-user-id-123",
	})
	assert.NoError(err)

	t.Run("should return all providers for user", func(t *testing.T) {
		providers, err := adapter.GetUserAuthProvidersByUserID(ctx, userID)
		assert.NoError(err)
		assert.Len(providers, 2)
	})

	t.Run("should return empty list for user with no providers", func(t *testing.T) {
		otherUserID := uuid.New()
		providers, err := adapter.GetUserAuthProvidersByUserID(ctx, otherUserID)
		assert.NoError(err)
		assert.Empty(providers)
	})
}

func updateUserAuthProvider(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)
	userID := uuid.New()

	providerID, err := uuid.NewV7()
	assert.NoError(err)

	provider := &models.UserAuthProvider{
		ID:             providerID,
		UserID:         userID,
		Provider:       models.AuthProviderPassword,
		ProviderUserID: "test@test.com",
		Password:       stringPtr("hashedpassword123"),
	}

	err = adapter.CreateUserAuthProvider(ctx, provider)
	assert.NoError(err)

	updatedProvider := &models.UserAuthProvider{
		ID:             providerID,
		UserID:         userID,
		Provider:       models.AuthProviderPassword,
		ProviderUserID: "test@test.com",
		Password:       stringPtr("newhashedpassword456"),
	}

	err = adapter.UpdateUserAuthProvider(ctx, providerID, updatedProvider)
	assert.NoError(err)

	result, err := adapter.GetUserAuthProviderByUserID(ctx, models.AuthProviderPassword, userID)
	assert.NoError(err)
	assert.NotNil(result)
	assert.Equal("newhashedpassword456", *result.Password)
}

func stringPtr(s string) *string {
	return &s
}
