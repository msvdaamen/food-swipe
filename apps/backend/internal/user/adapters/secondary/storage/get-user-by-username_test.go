package storage_test

import (
	"context"
	"testing"

	testhelpers "github.com/food-swipe/internal/pkg/test"
	"github.com/food-swipe/internal/user/adapters/secondary/storage"
	"github.com/food-swipe/internal/user/core/models"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestGetUserByUsername(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)

	t.Run("Get user by username", func(t *testing.T) {
		pool := container.Setup(t)
		getUserByUsername(t, pool)
	})
}

func getUserByUsername(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	createdUser, err := adapter.CreateUser(ctx, &models.CreateUserParams{
		Email:    "test@test.com",
		Username: "test",
		Name:     "test",
	})
	assert.NoError(err)

	t.Run("should return user when found", func(t *testing.T) {
		user, err := adapter.GetUserByUsername(ctx, "test")
		assert.NoError(err)
		assert.Equal(user, createdUser)
	})

	t.Run("should return not found when no result", func(t *testing.T) {
		user, err := adapter.GetUserByUsername(ctx, "test2")
		assert.ErrorIs(err, storage.ErrUserNotFound)
		assert.Nil(user)
	})
}
