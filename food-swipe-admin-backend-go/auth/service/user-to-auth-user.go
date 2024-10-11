package service

import userService "food-swipe.app/user/service"

func UserToAuthUser(user userService.User) AuthUser {
	return AuthUser{
		Id:        user.Id,
		Email:     user.Email,
		Username:  user.Username,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		IsAdmin:   user.IsAdmin,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}
