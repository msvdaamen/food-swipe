package port

import (
	"context"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/user/core/models"
)

type Storage interface {
	GetUserByID(ctx context.Context, userID string) (*models.User, error)
	GetUsers(ctx context.Context, page uint32, limit uint32) (*pagination.PaginationResponse[models.User], error)
}
