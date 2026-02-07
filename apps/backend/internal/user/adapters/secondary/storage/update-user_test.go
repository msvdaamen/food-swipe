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

func TestUpdateUser(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)

	t.Run("Update user", func(t *testing.T) {
		pool := container.Setup(t)
		updateUser(t, pool)
	})
}

func updateUser(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	createdUser, err := adapter.CreateUser(ctx, &models.CreateUserParams{
		Email:           "test@test.com",
		Username:        "test",
		Name:            "test",
		DisplayUsername: stringPtr("test"),
		Image:           stringPtr("image"),
	})
	assert.NoError(err)
	user, err := adapter.UpdateUser(ctx, &models.UpdateUserParams{
		ID:              createdUser.ID,
		Name:            "test2",
		Email:           "test2@test.com",
		DisplayUsername: stringPtr("test2"),
		Image:           stringPtr("image2"),
	})
	assert.NoError(err)
	assert.NotNil(user)
	assert.Equal(user.Email, "test2@test.com")
	assert.Equal(user.Username, "test")
	assert.Equal(user.Name, "test2")
	assert.Equal(*user.DisplayUsername, "test2")
	assert.Equal(*user.Image, "image2")
	assert.Equal(user.EmailVerified, false)
	assert.Equal(user.Role, "user")
	assert.Equal(user.Banned, false)
}
