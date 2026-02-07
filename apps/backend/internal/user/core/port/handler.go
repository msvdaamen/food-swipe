package port

import (
	"context"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/user/core/models"
)

type Handler interface {
	GetUsers(ctx context.Context, page uint32, limit uint32) (*pagination.PaginationResponse[models.User], error)
	GetUserByID(ctx context.Context, userID string) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
	GetUserByUsername(ctx context.Context, username string) (*models.User, error)
	CreateUser(ctx context.Context, params *models.CreateUserParams) (*models.User, error)
	UpdateUser(ctx context.Context, params *models.UpdateUserParams) (*models.User, error)
}
