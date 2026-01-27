package storage

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/user/core/models"
)

const selectUsersPaginated = `
	SELECT
		id,
		name,
		email,
		email_verified,
		image,
		username,
		display_username,
		role,
		banned,
		ban_reason,
		ban_expires,
		created_at,
		updated_at
	FROM users
	ORDER BY id ASC
	LIMIT $1 OFFSET $2
`

func (a *Adapter) GetUsers(ctx context.Context, page uint32, limit uint32) (*pagination.PaginationResponse[models.User], error) {
	rows, err := a.db.Query(ctx, selectUsersPaginated, limit, (page-1)*limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get users from storage: %w", err)
	}
	defer rows.Close()

	users := []models.User{}
	for rows.Next() {

		user, err := scanUser(rows)

		if err != nil {
			return nil, fmt.Errorf("failed to scan user from storage: %w", err)
		}
		users = append(users, user)
	}

	paginated := pagination.New(users, uint32(len(users)), page, limit)
	return paginated, nil
}
