package grpc

import (
	"context"
	"fmt"

	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/google/uuid"
)

func (a *Adapter) GetUserById(ctx context.Context, req *api.GetUserByIdRequest) (*api.GetUserByIdResponse, error) {
	userID, err := uuid.Parse(req.Id)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}
	user, err := a.core.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return &api.GetUserByIdResponse{
		User: modelUserToApiUser(user),
	}, nil
}
