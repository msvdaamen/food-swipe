package core

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
)

func (c *Core) GetUserByID(ctx context.Context, userID string) (*models.User, error) {
	user, err := c.storage.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user from storage: %w", err)
	}
	return user, nil
}
