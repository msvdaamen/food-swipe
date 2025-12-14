package core

import (
	"context"
	"fmt"
)

func (c *Core) Follow(ctx context.Context, userID string, followerID string) error {
	err := c.storage.Follow(ctx, userID, followerID)
	if err != nil {
		return fmt.Errorf("Failed to add the follow to storage: %w", err)
	}
	return nil
}
