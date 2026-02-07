package user

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/pkg/user"
	userModel "github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"

	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
)

func (a *Adapter) GetUserByID(ctx context.Context, userID uuid.UUID) (*userModel.User, error) {
	resp, err := a.client.GetUserById(ctx, &v1.GetUserByIdRequest{
		Id: userID.String(),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}

	user, err := user.ProtoUserToModel(resp.User)
	if err != nil {
		return nil, fmt.Errorf("failed to map user: %w", err)
	}

	return user, nil
}
