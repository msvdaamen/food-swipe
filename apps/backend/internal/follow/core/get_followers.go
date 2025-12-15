package core

import (
	"context"
	"fmt"
)

// GetFollowers retrieves a list of users a user is followed by.
func (c *Core) GetFollowers(ctx context.Context, userID string) ([]string, error) {
	followers, err := c.storage.GetFollowers(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("Failed to retrieve followers: %w", err)
	}
	return followers, nil
}
