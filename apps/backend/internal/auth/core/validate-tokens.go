package core

import (
	"context"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var (
	ErrInvalidToken     = errors.New("invalid token")
	ErrExpiredToken     = errors.New("expired token")
	ErrInvalidTokenType = errors.New("invalid token type")
)

// ValidateAccessToken validates and parses an access token
func (c *Core) ValidateAccessToken(ctx context.Context, tokenString string) (*models.User, error) {
	claims := &Claims{}

	err := c.jwtManager.ValidateToken(tokenString, claims)

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

	user, err := c.storage.GetUserByID(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	// Check if user is banned
	if user.Banned {
		return nil, ErrUserBanned
	}

	return user, nil
}

// ValidateRefreshToken validates and parses a refresh token
func (c *Core) ValidateRefreshToken(ctx context.Context, tokenString string) (*models.User, error) {
	claims := &Claims{}

	err := c.jwtManager.ValidateToken(tokenString, claims)

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	refreshToken, err := c.storage.GetRefreshTokenByHash(ctx, claims.Subject)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	user, err := c.storage.GetUserByID(ctx, refreshToken.UserID)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	return user, nil
}
