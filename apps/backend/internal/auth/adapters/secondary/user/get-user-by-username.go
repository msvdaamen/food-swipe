package user

import (
	"context"
	"fmt"

	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/pkg/user"
	"github.com/food-swipe/internal/user/core/models"
)

func (a *Adapter) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	resp, err := a.client.GetUserByUsername(ctx, &v1.GetUserByUsernameRequest{
		Username: username,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}

	user, err := user.ProtoUserToModel(resp.User)
	if err != nil {
		return nil, fmt.Errorf("failed to map user: %w", err)
	}

	return user, nil
}
