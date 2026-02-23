package user

import (
	"context"
	"fmt"

	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	userPkg "github.com/food-swipe/internal/pkg/user"
	"github.com/food-swipe/internal/user/core/models"
)

func (a *Adapter) CreateUser(ctx context.Context, user *models.User) (*models.User, error) {
	req := &v1.CreateUserRequest{
		Email:           user.Email,
		Username:        user.Username,
		Name:            user.Name,
		DisplayUsername: user.DisplayUsername,
		Image:           user.Image,
	}

	response, err := a.client.CreateUser(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to create user via grpc: %w", err)
	}

	userModel, err := userPkg.ProtoUserToModel(response.User)
	if err != nil {
		return nil, fmt.Errorf("failed to convert user proto to model: %w", err)
	}

	return userModel, nil
}
