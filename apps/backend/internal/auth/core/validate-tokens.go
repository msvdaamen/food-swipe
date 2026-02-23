package core

import (
	"context"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/auth/core/models"
	userModel "github.com/food-swipe/internal/user/core/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("expired token")
)

// ValidateAccessToken validates and parses an access token
func (c *Core) ValidateAccessToken(ctx context.Context, tokenString string) (*uuid.UUID, error) {
	claims := &Claims{}

	err := c.jwt.ValidateToken(tokenString, claims)

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	userId, err := uuid.Parse(claims.Subject)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	return &userId, nil
}

// ValidateRefreshToken validates and parses a refresh token
func (c *Core) ValidateRefreshToken(ctx context.Context, tokenString string) (*models.RefreshToken, *userModel.User, error) {
	claims := &Claims{}

	err := c.jwt.ValidateToken(tokenString, claims)

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, nil, ErrExpiredToken
		}
		return nil, nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	refreshTokenID, err := uuid.Parse(claims.ID)
	if err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	refreshToken, err := c.storage.GetRefreshTokenByID(ctx, refreshTokenID)
	if err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	if refreshToken.RevokedAt != nil {
		return nil, nil, ErrInvalidToken
	}

	user, err := c.user.GetUserByID(ctx, refreshToken.UserID)
	if err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	return refreshToken, user, nil
}
