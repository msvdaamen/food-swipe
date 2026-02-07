package grpc

import (
	"context"

	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/user/core/models"
)

func (a *Adapter) CreateUser(ctx context.Context, req *api.CreateUserRequest) (*api.CreateUserResponse, error) {
	params := &models.CreateUserParams{
		Email:           req.Email,
		Username:        req.Username,
		Name:            req.Name,
		DisplayUsername: req.DisplayUsername,
		Image:           req.Image,
	}

	user, err := a.core.CreateUser(ctx, params)
	if err != nil {
		return nil, err
	}

	return &api.CreateUserResponse{
		User: modelUserToApiUser(user),
	}, nil
}
