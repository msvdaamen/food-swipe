package storage

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"time"
)

func (s *Storage) CreateRefreshToken(userId int32, expiresAt time.Time) (*RefreshToken, error) {
	sql := `INSERT INTO auth_refresh_tokens (id, user_id, expires_at) VALUES ($1, $2, $3) RETURNING id, user_id, expires_at`
	uuidObj := uuid.New()
	row := s.db.QueryRow(context.Background(), sql, uuidObj, userId, expiresAt)
	token := &RefreshToken{}
	err := row.Scan(
		&token.Id,
		&token.UserId,
		&token.ExpiresAt,
	)
	if err != nil {
		return nil, fmt.Errorf("error creating refresh token: %w", err)
	}
	return token, nil
}
