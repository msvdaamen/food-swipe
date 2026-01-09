package grpc

import (
	"context"
	"fmt"

	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Adapter) GetFollowing(ctx context.Context, req *api.GetFollowingRequest) (*api.GetFollowingResponse, error) {
	userIds, err := a.core.GetFollowing(ctx, req.UserId)
	if err != nil {
		return nil, fmt.Errorf("failed to get following: %w", err)
	}
	return &api.GetFollowingResponse{Following: userIds}, nil
}
