package port

import (
	"context"

	"github.com/food-swipe/internal/user/core/models"
)

type Storage interface {
	GetUserByID(ctx context.Context, userID string) (*models.User, error)
}
