package core

import (
	"context"

	"github.com/food-swipe/internal/user/core/models"
)

func (c *Core) UpdateUser(ctx context.Context, params *models.UpdateUserParams) (*models.User, error) {
	return c.storage.UpdateUser(ctx, params)
}
