package storage

import (
	"context"
	"fmt"
)

// Follow adds a follower to a user's followers list.
func (s *Adapter) Follow(ctx context.Context, userID string, followerID string) error {
	_, err := s.db.Exec(ctx, "INSERT INTO followers (user_id, follower_id) VALUES ($1, $2)", userID, followerID)
	if err != nil {
		return fmt.Errorf("Failed to insert follow: %w", err)
	}
	return nil
}
