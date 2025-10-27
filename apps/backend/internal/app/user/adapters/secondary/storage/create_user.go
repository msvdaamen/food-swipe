package storage

import (
	"context"
	"time"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
)

const createUserQuery = `INSERT INTO users (id, email, first_name, last_name, auth_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)`

func (s *Storage) CreateUser(ctx context.Context, payload *model.CreateUserPayload) (model.User, error) {
	now := time.Now()
	_, err := s.database.Exec(ctx, createUserQuery, payload.ID, payload.Email, payload.FirstName, payload.LastName, payload.AuthID, now)
	if err != nil {
		return model.User{}, err
	}

	return model.User{
		ID:        payload.ID,
		Email:     payload.Email,
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		CreatedAt: now,
	}, nil
}
