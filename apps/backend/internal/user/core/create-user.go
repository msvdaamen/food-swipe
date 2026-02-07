package core

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
)

func (c *Core) CreateUser(ctx context.Context, params *models.CreateUserParams) (*models.User, error) {
	user, err := c.storage.CreateUser(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	return user, nil
}
