package grpc

import (
	"context"

	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Adapter) GetUserByUsername(ctx context.Context, req *api.GetUserByUsernameRequest) (*api.GetUserByUsernameResponse, error) {
	user, err := a.core.GetUserByUsername(ctx, req.Username)
	if err != nil {
		return nil, err
	}
	return &api.GetUserByUsernameResponse{
		User: modelUserToApiUser(user),
	}, nil
}
