package port

import (
	"context"

	"github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

type User interface {
	GetUserByID(ctx context.Context, userID uuid.UUID) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
	GetUserByUsername(ctx context.Context, username string) (*models.User, error)

	CreateUser(ctx context.Context, user *models.User) (*models.User, error)
	UpdateUser(ctx context.Context, userID uuid.UUID, user *models.User) (*models.User, error)
}
