package port

import (
	"context"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
)

// User interface defines the methods for interacting with the user servce.
type User interface {
	ExistsByAuthId(ctx context.Context, authId string) (bool, error)
	CreateUser(ctx context.Context, payload *model.CreateUserPayload) (*model.User, error)
}
