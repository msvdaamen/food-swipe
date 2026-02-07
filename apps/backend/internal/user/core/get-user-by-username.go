package core

import (
	"context"

	"github.com/food-swipe/internal/user/core/models"
)

func (c *Core) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	return c.storage.GetUserByUsername(ctx, username)
}
