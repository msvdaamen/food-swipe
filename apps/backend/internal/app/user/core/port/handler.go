package port

import (
	"context"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
)

type Handler interface {
	GetUsers(ctx context.Context) ([]model.User, error)
}
