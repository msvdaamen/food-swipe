package storage

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
)

const updateQuery = `
	UPDATE users
	SET name = $2, email = $3, display_username = $4, image = $5
	WHERE id = $1
	RETURNING %s
`

func (a *Adapter) UpdateUser(ctx context.Context, params *models.UpdateUserParams) (*models.User, error) {
	args := []any{
		params.ID,
		params.Name,
		params.Email,
		params.DisplayUsername,
		params.Image,
	}

	row := a.db.QueryRow(
		ctx,
		fmt.Sprintf(updateQuery, userFields),
		args...,
	)
	var user models.User
	user, err := scanUser(row)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return &user, nil
}
