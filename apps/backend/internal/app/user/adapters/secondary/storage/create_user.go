package storage

import (
	"context"
	"time"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
)

const createUserQuery = `INSERT INTO users (id, email, auth_id, created_at) VALUES ($1, $2, $3, $4)`

func (s *Storage) CreateUser(ctx context.Context, payload *model.CreateUserPayload) (*model.User, error) {
	now := time.Now()
	_, err := s.database.Exec(ctx, createUserQuery, payload.ID, payload.Email, payload.AuthID, now)
	if err != nil {
		return nil, err
	}

	return &model.User{
		ID:        payload.ID,
		Email:     payload.Email,
		AuthID:    payload.AuthID,
		CreatedAt: now,
	}, nil
}
