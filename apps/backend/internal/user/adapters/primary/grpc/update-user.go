package grpc

import (
	"context"
	"fmt"

	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

func (a *Adapter) UpdateUser(ctx context.Context, req *api.UpdateUserRequest) (*api.UpdateUserResponse, error) {
	userID, err := uuid.Parse(req.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to parse user ID: %w", err)
	}

	params := &models.UpdateUserParams{
		ID:              userID,
		Name:            req.Name,
		Email:           req.Email,
		DisplayUsername: req.DisplayUsername,
		Image:           req.Image,
	}

	user, err := a.core.UpdateUser(ctx, params)
	if err != nil {
		return nil, err
	}

	return &api.UpdateUserResponse{
		User: modelUserToApiUser(user),
	}, nil
}
