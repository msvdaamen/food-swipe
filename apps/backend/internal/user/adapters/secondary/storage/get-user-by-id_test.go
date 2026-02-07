package storage_test

import (
	"context"
	"testing"

	testhelpers "github.com/food-swipe/internal/pkg/test"
	"github.com/food-swipe/internal/user/adapters/secondary/storage"
	"github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestGetUserById(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)

	t.Run("Get user by id", func(t *testing.T) {
		pool := container.Setup(t)
		getUserByID(t, pool)
	})

	t.Run("Should return not found when no result", func(t *testing.T) {
		pool := container.Setup(t)
		getUserByIDNotFound(t, pool)
	})
}

func getUserByID(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	createdUser, err := adapter.CreateUser(ctx, &models.CreateUserParams{
		Email:    "test@test.com",
		Username: "test",
		Name:     "test",
	})
	assert.NoError(err)

	user, err := adapter.GetUserByID(ctx, createdUser.ID)
	assert.NoError(err)
	assert.Equal(user, createdUser)
}

func getUserByIDNotFound(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	user, err := adapter.GetUserByID(ctx, uuid.New())
	assert.ErrorIs(err, storage.ErrUserNotFound)
	assert.Nil(user)
}
