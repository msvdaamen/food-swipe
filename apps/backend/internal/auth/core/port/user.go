package port

import (
	"context"

	"github.com/food-swipe/internal/auth/core/models"
)

type User interface {
	GetUserByID(ctx context.Context, userID string) (*models.User, error)
	UpdateUsername(ctx context.Context, userID string, username string) error
	UpdateDisplayUsername(ctx context.Context, userID string, displayUsername *string)
}
