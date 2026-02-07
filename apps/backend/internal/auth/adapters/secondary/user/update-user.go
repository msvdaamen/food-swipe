package user

import (
	"context"
	"fmt"

	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

func (a *Adapter) UpdateUser(ctx context.Context, userID uuid.UUID, user *models.User) error {
	req := &v1.UpdateUserRequest{
		Id:              userID.String(),
		Name:            user.Name,
		Email:           user.Email,
		DisplayUsername: user.DisplayUsername,
		Image:           user.Image,
	}

	_, err := a.client.UpdateUser(ctx, req)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}
