package user

import (
	"context"
	"fmt"

	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/user/core/models"
)

func (a *Adapter) CreateUser(ctx context.Context, user *models.User) error {
	req := &v1.CreateUserRequest{
		Email:           user.Email,
		Username:        user.Username,
		Name:            user.Name,
		DisplayUsername: user.DisplayUsername,
		Image:           user.Image,
	}

	_, err := a.client.CreateUser(ctx, req)
	if err != nil {
		return fmt.Errorf("failed to create user via grpc: %w", err)
	}

	return nil
}
