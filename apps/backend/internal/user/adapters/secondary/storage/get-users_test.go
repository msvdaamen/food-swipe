package storage_test

import (
	"context"
	"testing"

	"github.com/food-swipe/internal/pkg/models/pagination"
	testhelpers "github.com/food-swipe/internal/pkg/test"
	"github.com/food-swipe/internal/user/adapters/secondary/storage"
	"github.com/food-swipe/internal/user/core/models"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestGetUsers(t *testing.T) {
	t.Parallel()
	container := testhelpers.SetupTestDatabase(t)

	t.Run("Get users", func(t *testing.T) {
		pool := container.Setup(t)
		getUsers(t, pool)
	})
}

func getUsers(t *testing.T, dbPool *pgxpool.Pool) {
	assert := assert.New(t)
	ctx := context.Background()

	adapter := storage.New(dbPool)

	createdUser1, err := adapter.CreateUser(ctx, &models.CreateUserParams{
		Email:    "test@test.com",
		Username: "test",
		Name:     "test",
	})
	assert.NoError(err)
	createdUser2, err := adapter.CreateUser(ctx, &models.CreateUserParams{
		Email:    "test2@test.com",
		Username: "test2",
		Name:     "test test",
	})
	assert.NoError(err)
	users := []models.User{
		*createdUser1,
		*createdUser2,
	}
	usersPage, err := adapter.GetUsers(ctx, 1, 10)
	assert.NoError(err)
	assert.Equal(usersPage.Data, users)
	assert.Equal(usersPage.Pagination, pagination.Pagination{
		PerPage:     10,
		TotalPages:  1,
		CurrentPage: 1,
		Total:       2,
	})
}
