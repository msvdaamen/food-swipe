package storage

import (
	"context"
	"fmt"
)

// GetFollowing retrieves a list of users a user is following.
func (s *Adapter) GetFollowing(ctx context.Context, userID string) ([]string, error) {
	rows, err := s.db.Query(ctx, "SELECT follower_id FROM followers WHERE user_id = $1", userID)
	if err != nil {
		return nil, fmt.Errorf("Failed to retrieve following: %w", err)
	}
	defer rows.Close()

	var following []string
	for rows.Next() {
		var followerID string
		if err := rows.Scan(&followerID); err != nil {
			return nil, fmt.Errorf("Failed to scan following ID: %w", err)
		}
		following = append(following, followerID)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Failed to iterate over rows: %w", err)
	}
	return following, nil
}
