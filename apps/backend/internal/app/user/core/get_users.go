package core

import (
	"context"
	"fmt"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
	"github.com/msvdaamen/food-swipe/internal/pkg/common"
)

func (c *Core) GetUsers(ctx context.Context, page int32, limit int32) (common.PaginationData[model.User], error) {
	users, err := c.storage.GetUsers(ctx, page, limit)
	if err != nil {
		return common.PaginationData[model.User]{}, fmt.Errorf("failed to get users: %w", err)
	}
	return users, nil
}
