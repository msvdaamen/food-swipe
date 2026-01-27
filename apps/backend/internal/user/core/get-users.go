package core

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/user/core/models"
)

func (c *Core) GetUsers(ctx context.Context, page uint32, limit uint32) (*pagination.PaginationResponse[models.User], error) {
	paginated, err := c.storage.GetUsers(ctx, page, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get users from storage: %w", err)
	}
	return paginated, nil
}
