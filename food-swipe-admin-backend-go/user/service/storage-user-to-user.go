package service

import "food-swipe.app/user/storage"

func storageUserToUser(storageUser storage.User) User {
	return User{
		Id:        storageUser.Id,
		Email:     storageUser.Email,
		Username:  storageUser.Username,
		Password:  storageUser.Password,
		FirstName: storageUser.FirstName,
		LastName:  storageUser.LastName,
		IsAdmin:   storageUser.IsAdmin,
		CreatedAt: storageUser.CreatedAt,
		UpdatedAt: storageUser.UpdatedAt,
	}
}
