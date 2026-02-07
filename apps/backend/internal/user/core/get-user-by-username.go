package core

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
)

func (c *Core) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	user, err := c.storage.GetUserByUsername(ctx, username)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}
	return user, nil
}
