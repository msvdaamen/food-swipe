package port

import (
	"context"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/user/core/models"
)

type Handler interface {
	GetUsers(ctx context.Context, page uint32, limit uint32) (*pagination.PaginationResponse[models.User], error)
	GetUserByID(ctx context.Context, userID string) (*models.User, error)
}
