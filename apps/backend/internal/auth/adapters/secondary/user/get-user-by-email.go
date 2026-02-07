package user

import (
	"context"
	"fmt"

	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/pkg/user"
	"github.com/food-swipe/internal/user/core/models"
)

func (a *Adapter) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	resp, err := a.client.GetUserByEmail(ctx, &v1.GetUserByEmailRequest{
		Email: email,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	user, err := user.ProtoUserToModel(resp.User)
	if err != nil {
		return nil, fmt.Errorf("failed to map user: %w", err)
	}

	return user, nil
}
