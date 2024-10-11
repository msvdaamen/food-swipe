package service

import (
	"food-swipe.app/common/jwt"
	"strconv"
	"time"
)

func (s *Service) createAccessToken(userId int32) (*string, error) {
	token, err := s.jwtService.Parse(jwt.ParseOptions{
		ExpiresAt: time.Now().Add(time.Minute * 10),
		Subject:   strconv.Itoa(int(userId)),
	})

	if err != nil {
		return nil, err
	}
	return token, nil
}
