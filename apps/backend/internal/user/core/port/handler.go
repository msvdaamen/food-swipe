package port

import (
	"context"

	"github.com/food-swipe/internal/user/core/models"
)

type Handler interface {
	GetUserByID(ctx context.Context, userID string) (*models.User, error)
}
