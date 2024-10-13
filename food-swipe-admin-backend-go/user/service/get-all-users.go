package service

import "fmt"

func (s *Service) GetAllUsers() (*[]User, error) {
	users, err := s.storage.FindAllUsers()
	if err != nil {
		return nil, fmt.Errorf("error finding all users: %v", err)
	}
	userModels := make([]User, len(*users))
	for i, user := range *users {
		userModels[i] = storageUserToUser(user)
	}

	return &userModels, nil
}
