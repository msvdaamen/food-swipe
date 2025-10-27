package core

import (
	"context"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
)

func (c *Core) GetUsers(ctx context.Context) ([]model.User, error) {
	return []model.User{}, nil
}
