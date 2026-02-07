package core

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
)

func (c *Core) UpdateUser(ctx context.Context, params *models.UpdateUserParams) (*models.User, error) {
	user, err := c.storage.UpdateUser(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}
	return user, nil
}
