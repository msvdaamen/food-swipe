package service

import (
	"fmt"
	"time"
)

type RefreshTokenResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func (s *Service) RefreshToken(refreshToken string) (*RefreshTokenResponse, error) {
	token, err := s.jwtService.Verify(refreshToken)
	if err != nil {
		return nil, fmt.Errorf("error verifying refresh token: %w", err)
	}
	refreshTokenId, err := token.Claims.GetSubject()
	if err != nil {
		return nil, fmt.Errorf("invalid refresh token: %w", err)
	}
	refreshTokenObj, err := s.storage.FindRefreshTokenById(refreshTokenId)
	if err != nil {
		return nil, fmt.Errorf("no refresh token found: %w", err)
	}
	if refreshTokenObj.ExpiresAt.Before(time.Now()) {
		return nil, fmt.Errorf("refresh token expired")
	}
	err = s.storage.DeleteRefreshTokenById(refreshTokenObj.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to delete refresh with id %s: %w", refreshTokenObj.Id, err)
	}
	user, err := s.userService.GetUserById(refreshTokenObj.UserId)
	if err != nil {
		return nil, fmt.Errorf("mo user found with id %d: %w", refreshTokenObj.UserId, err)
	}
	accessToken, err := s.createAccessToken(user.Id)
	if err != nil {
		return nil, fmt.Errorf("error creating access token for user: %d, %w", user.Id, err)
	}
	newRefreshToken, err := s.createRefreshToken(user.Id)
	if err != nil {
		return nil, fmt.Errorf("error creating refresh token for user: %d, %w", user.Id, err)
	}
	return &RefreshTokenResponse{
		AccessToken:  *accessToken,
		RefreshToken: *newRefreshToken,
	}, nil
}
