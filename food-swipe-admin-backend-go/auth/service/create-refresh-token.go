package service

import (
	"fmt"
	"food-swipe.app/common/jwt"
	"time"
)

func (s *Service) createRefreshToken(userId int32) (*string, error) {
	expiresAt := time.Now().AddDate(0, 3, 0)
	token, err := s.storage.CreateRefreshToken(userId, expiresAt)
	if err != nil {
		return nil, fmt.Errorf("error creating refresh token: %w", err)
	}
	jwtStr, err := s.jwtService.Parse(jwt.ParseOptions{
		ExpiresAt: token.ExpiresAt,
		Subject:   token.Id,
	})
	if err != nil {
		return nil, fmt.Errorf("error creating jwt token: %w", err)
	}
	return jwtStr, nil
}
