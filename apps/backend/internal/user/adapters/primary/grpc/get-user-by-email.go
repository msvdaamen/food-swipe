package grpc

import (
	"context"

	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Adapter) GetUserByEmail(ctx context.Context, req *api.GetUserByEmailRequest) (*api.GetUserByEmailResponse, error) {
	user, err := a.core.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	return &api.GetUserByEmailResponse{
		User: modelUserToApiUser(user),
	}, nil
}
