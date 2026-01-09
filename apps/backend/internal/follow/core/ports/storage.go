package ports

import "context"

type Storage interface {
	// Follow adds a follower to a user's followers list.
	Follow(ctx context.Context, userID string, followerID string) error
	GetFollowers(ctx context.Context, userID string) ([]string, error)
	GetFollowing(ctx context.Context, userID string) ([]string, error)
}
