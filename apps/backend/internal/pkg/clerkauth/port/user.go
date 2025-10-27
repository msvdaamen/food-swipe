package port

import (
	"context"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
)

// User interface defines the methods for interacting with the user servce.
type User interface {
	CreateUser(ctx context.Context, payload *model.CreateUserPayload) (model.User, error)
	GetUserByAuthId(ctx context.Context, authId string) (model.User, error)
}
