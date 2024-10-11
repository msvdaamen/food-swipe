package storage

import (
	"context"
	"fmt"
)

func (s *Storage) DeleteRefreshTokenById(id string) error {
	_, err := s.db.Exec(context.Background(), "DELETE FROM auth_refresh_tokens WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("error deleting refresh token: %w", err)
	}
	return nil
}
