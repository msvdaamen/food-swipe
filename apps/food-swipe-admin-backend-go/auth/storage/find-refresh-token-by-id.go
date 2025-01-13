package storage

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
)

func (s *Storage) FindRefreshTokenById(id string) (*RefreshToken, error) {
	rows, err := s.db.Query(context.Background(), "SELECT id, user_id, expires_at FROM auth_refresh_tokens WHERE id = $1", id)
	refreshToken, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[RefreshToken])
	if err != nil {
		return nil, fmt.Errorf("error finding refresh token by id: %w", err)
	}
	return &refreshToken, nil
}
