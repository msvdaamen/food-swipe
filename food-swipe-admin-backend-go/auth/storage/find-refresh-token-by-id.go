package storage

import (
	"context"
	"fmt"
)

func (s *Storage) FindRefreshTokenById(id string) (*RefreshToken, error) {
	refreshToken := &RefreshToken{}
	err := s.db.QueryRow(context.Background(), "SELECT id, user_id, expires_at FROM auth_refresh_tokens WHERE id = $1", id).Scan(&refreshToken.Id, &refreshToken.UserId, &refreshToken.ExpiresAt)
	if err != nil {
		return nil, fmt.Errorf("error finding refresh token by id: %w", err)
	}
	return refreshToken, nil
}
