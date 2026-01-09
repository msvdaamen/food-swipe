package storage

import (
	"context"
	"fmt"
)

// GetFollowers retrieves a list of followers for a user.
func (s *Adapter) GetFollowers(ctx context.Context, userID string) ([]string, error) {
	rows, err := s.db.Query(ctx, "SELECT user_id FROM followers WHERE follower_id = $1", userID)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve followers: %w", err)
	}
	defer rows.Close()

	var followers []string
	for rows.Next() {
		var followerID string
		if err := rows.Scan(&followerID); err != nil {
			return nil, fmt.Errorf("failed to scan follower ID: %w", err)
		}
		followers = append(followers, followerID)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to iterate over rows: %w", err)
	}
	return followers, nil
}
