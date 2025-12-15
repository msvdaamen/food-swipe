package grpc

import (
	"context"
	"fmt"

	followv1 "github.com/food-swipe/gen/grpc/followers/v1"
)

func (a *Adapter) Follow(ctx context.Context, req *followv1.FollowRequest) (*followv1.FollowResponse, error) {
	err := a.core.Follow(ctx, req.UserId, req.FollowerId)
	if err != nil {
		return nil, fmt.Errorf("failed to follow: %w", err)
	}
	return &followv1.FollowResponse{}, nil
}
