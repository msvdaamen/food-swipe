package storage

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

const insertUser = `
	INSERT INTO users (
		id,
		email,
		username,
		name,
		display_username,
		image,
		email_verified,
		role,
		banned
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	RETURNING %s
`

func (a *Adapter) CreateUser(ctx context.Context, params *models.CreateUserParams) (*models.User, error) {
	userID, err := uuid.NewV7()
	if err != nil {
		return nil, fmt.Errorf("failed to generate user ID: %w", err)
	}

	row := a.db.QueryRow(
		ctx,
		fmt.Sprintf(insertUser, userFields),
		userID,
		params.Email,
		params.Username,
		params.Name,
		params.DisplayUsername,
		params.Image,
		false,  // email_verified defaults to false
		"user", // role defaults to user
		false,  // banned defaults to false
	)

	user, err := scanUser(row)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return &user, nil
}
