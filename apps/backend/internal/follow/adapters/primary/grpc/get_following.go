package grpc

import (
	"context"
	"fmt"

	followv1 "github.com/food-swipe/gen/grpc/followers/v1"
)

func (a *Adapter) GetFollowing(ctx context.Context, req *followv1.GetFollowingRequest) (*followv1.GetFollowingResponse, error) {
	userIds, err := a.core.GetFollowing(ctx, req.UserId)
	if err != nil {
		return nil, fmt.Errorf("failed to get following: %w", err)
	}
	return &followv1.GetFollowingResponse{Following: userIds}, nil
}
