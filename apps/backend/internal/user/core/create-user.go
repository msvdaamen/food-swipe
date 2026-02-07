package core

import (
	"context"

	"github.com/food-swipe/internal/user/core/models"
)

func (c *Core) CreateUser(ctx context.Context, params *models.CreateUserParams) (*models.User, error) {
	return c.storage.CreateUser(ctx, params)
}
