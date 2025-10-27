package storage

import (
	"context"
	"fmt"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
)

const selectUserByAuthIdQuery = `SELECT id, email, created_at FROM users WHERE auth_id = $1`

func (s *Storage) GetUserByAuthId(ctx context.Context, authId string) (model.User, error) {
	var user model.User
	err := s.database.QueryRow(ctx, selectUserByAuthIdQuery, authId).Scan(&user.ID, &user.Email, &user.CreatedAt)
	if err != nil {
		return model.User{}, fmt.Errorf("failed to get user by auth id: %w", err)
	}

	return user, nil
}
