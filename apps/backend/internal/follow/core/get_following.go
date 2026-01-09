package core

import (
	"context"
	"fmt"
)

// GetFollowing retrieves a list of users a user is following.
func (c *Core) GetFollowing(ctx context.Context, userID string) ([]string, error) {
	followers, err := c.storage.GetFollowing(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve list of users a user is following: %w", err)
	}
	return followers, nil
}
