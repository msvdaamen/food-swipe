package storage

import (
	"context"
	"fmt"
)

func (s *Storage) DeleteRefreshTokenByUserId(userId int32) error {
	_, err := s.db.Exec(context.Background(), "DELETE FROM auth_refresh_tokens WHERE user_id = $1", userId)
	if err != nil {
		return fmt.Errorf("error deleting refresh token: %w", err)
	}
	return nil
}
