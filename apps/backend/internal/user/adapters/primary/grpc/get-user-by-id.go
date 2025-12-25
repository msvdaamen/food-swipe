package grpc

import (
	"context"

	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Adapter) GetUserById(ctx context.Context, req *api.GetUserByIdRequest) (*api.GetUserByIdResponse, error) {
	user, err := a.core.GetUserByID(ctx, req.Id)
	if err != nil {
		return nil, err
	}
	return &api.GetUserByIdResponse{
		User: modelUserToApiUser(user),
	}, nil
}
