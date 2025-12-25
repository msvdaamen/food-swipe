package grpc

import (
	api "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/user/core/models"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
)

func modelUserToApiUser(user *models.User) *api.User {
	var banExpires *timestamppb.Timestamp
	if user.BanExpires != nil {
		banExpires = timestamppb.New(*user.BanExpires)
	}
	return &api.User{
		Id:              user.ID.String(),
		Name:            user.Name,
		Email:           user.Email,
		EmailVerified:   user.EmailVerified,
		Image:           user.Image,
		Username:        user.Username,
		DisplayUsername: user.DisplayUsername,
		Role:            user.Role,
		Banned:          user.Banned,
		BanReason:       user.BanReason,
		BanExpires:      banExpires,
		CreatedAt:       timestamppb.New(user.CreatedAt),
		UpdatedAt:       timestamppb.New(user.UpdatedAt),
	}
}
