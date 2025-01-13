package service

import (
	"fmt"
)

func (s *Service) GetUserById(userId int32) (*User, error) {
	user, err := s.storage.FindUserById(userId)
	if err != nil {
		return nil, fmt.Errorf("error finding user by id: %b, %v", userId, err)
	}

	serviceUser := storageUserToUser(*user)
	return &serviceUser, nil
}
