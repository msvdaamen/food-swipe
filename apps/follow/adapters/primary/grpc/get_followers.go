package grpc

import (
	"context"
	"fmt"

	followv1 "github.com/food-swipe/gen/followers/v1"
)

func (a *Adapter) GetFollowers(ctx context.Context, req *followv1.GetFollowersRequest) (*followv1.GetFollowersResponse, error) {
	userIds, err := a.core.GetFollowers(ctx, req.UserId)
	if err != nil {
		return nil, fmt.Errorf("failed to get followers: %w", err)
	}
	return &followv1.GetFollowersResponse{Followers: userIds}, nil
}
