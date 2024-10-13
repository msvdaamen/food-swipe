package service

import (
	"fmt"
)

func (s *Service) GetUserByEmail(email string) (*User, error) {
	user, err := s.storage.FindUserByEmail(email)
	if err != nil {
		return nil, fmt.Errorf("error finding user by email: %s, %v", email, err)
	}

	serviceUser := storageUserToUser(*user)
	return &serviceUser, nil
}
