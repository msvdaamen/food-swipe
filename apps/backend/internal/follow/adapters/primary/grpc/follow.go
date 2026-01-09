package grpc

import (
	"context"
	"fmt"

	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Adapter) Follow(ctx context.Context, req *api.FollowRequest) (*api.FollowResponse, error) {
	err := a.core.Follow(ctx, req.UserId, req.FollowerId)
	if err != nil {
		return nil, fmt.Errorf("failed to follow: %w", err)
	}
	return &api.FollowResponse{}, nil
}
