package storage

import (
	"context"
	"fmt"

	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
	"github.com/msvdaamen/food-swipe/internal/pkg/common"
)

const selectAllUsers = "SELECT id, email, first_name, last_name, created_at FROM users ORDER BY id LIMIT $1 OFFSET $2"
const selectAllUsersTotal = "SELECT COUNT(*) as total FROM users"

func (s *Storage) GetUsers(ctx context.Context, page int32, limit int32) (common.PaginationData[model.User], error) {
	users := []model.User{}
	rows, err := s.database.Query(ctx, selectAllUsers, limit, (page-1)*limit)
	if err != nil {
		return common.PaginationData[model.User]{}, fmt.Errorf("failed to query users: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var user model.User
		if err := rows.Scan(&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.CreatedAt); err != nil {
			return common.PaginationData[model.User]{}, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, user)
	}

	var total int32
	err = s.database.QueryRow(ctx, selectAllUsersTotal).Scan(&total)
	if err != nil {
		return common.PaginationData[model.User]{}, fmt.Errorf("failed to query users total: %w", err)
	}

	totalPages := int32(0)
	if total > 0 {
		totalPages = total / limit
	}

	return common.PaginationData[model.User]{
		Data: users,
		Pagination: common.Pagination{
			Total:       total,
			PerPage:     limit,
			TotalPages:  totalPages,
			CurrentPage: page,
		},
	}, nil
}
