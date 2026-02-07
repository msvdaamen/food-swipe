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

func TestCreateUser(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)

	t.Run("Create user", func(t *testing.T) {
		pool := container.Setup(t)
		createUser(t, pool)
	})
}

func createUser(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	user, err := adapter.CreateUser(ctx, &models.CreateUserParams{
		Email:           "test@test.com",
		Username:        "test",
		Name:            "test",
		DisplayUsername: stringPtr("test"),
		Image:           stringPtr("image"),
	})
	assert.NoError(err)
	assert.NotNil(user)
	assert.Equal(user.Email, "test@test.com")
	assert.Equal(user.Username, "test")
	assert.Equal(user.Name, "test")
	assert.Equal(*user.DisplayUsername, "test")
	assert.Equal(*user.Image, "image")
	assert.Equal(user.EmailVerified, false)
	assert.Equal(user.Role, "user")
	assert.Equal(user.Banned, false)
}

func stringPtr(value string) *string {
	return &value
}
