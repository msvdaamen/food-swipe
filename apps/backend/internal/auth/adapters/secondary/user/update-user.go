package user

import (
	"context"
	"fmt"

	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	userPkg "github.com/food-swipe/internal/pkg/user"
	"github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

func (a *Adapter) UpdateUser(ctx context.Context, userID uuid.UUID, user *models.User) (*models.User, error) {
	req := &v1.UpdateUserRequest{
		Id:              userID.String(),
		Name:            user.Name,
		Email:           user.Email,
		DisplayUsername: &user.DisplayUsername,
		Image:           user.Image,
	}

	response, err := a.client.UpdateUser(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	userModel, err := userPkg.ProtoUserToModel(response.User)
	if err != nil {
		return nil, fmt.Errorf("failed to convert user proto to model: %w", err)
	}

	return userModel, nil
}
