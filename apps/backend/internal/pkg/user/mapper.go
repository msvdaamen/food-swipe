package user

import (
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

// ProtoUserToModel converts a protobuf User to a model User.
func ProtoUserToModel(pb *v1.User) (*models.User, error) {
	id, err := uuid.Parse(pb.Id)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		ID:              id,
		Name:            pb.Name,
		Email:           pb.Email,
		EmailVerified:   pb.EmailVerified,
		Image:           pb.Image,
		Username:        pb.Username,
		DisplayUsername: pb.DisplayUsername,
		Role:            pb.Role,
		Banned:          pb.Banned,
		BanReason:       pb.BanReason,
	}

	if pb.BanExpires != nil {
		t := pb.BanExpires.AsTime()
		user.BanExpires = &t
	}

	if pb.CreatedAt != nil {
		user.CreatedAt = pb.CreatedAt.AsTime()
	}

	if pb.UpdatedAt != nil {
		user.UpdatedAt = pb.UpdatedAt.AsTime()
	}

	return user, nil
}
