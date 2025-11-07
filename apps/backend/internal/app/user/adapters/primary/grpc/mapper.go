package grpc

import (
	apiv1 "github.com/msvdaamen/food-swipe/gen/api/v1"
	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
)

func userModelToApi(user *model.User) *apiv1.User {
	return &apiv1.User{
		Id:        user.ID,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
}
