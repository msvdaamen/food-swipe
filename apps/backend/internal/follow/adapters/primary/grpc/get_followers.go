package grpc

import (
	"context"
	"fmt"

	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Adapter) GetFollowers(ctx context.Context, req *api.GetFollowersRequest) (*api.GetFollowersResponse, error) {
	userIds, err := a.core.GetFollowers(ctx, req.UserId)
	if err != nil {
		return nil, fmt.Errorf("failed to get followers: %w", err)
	}
	return &api.GetFollowersResponse{Followers: userIds}, nil
}
