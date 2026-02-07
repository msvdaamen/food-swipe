package core

import (
	"fmt"
	"time"

	userModel "github.com/food-swipe/internal/user/core/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type Claims struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateAccessToken creates a new JWT access token
func (c *Core) GenerateAccessToken(user *userModel.User) (string, time.Time, error) {
	expiresAt := time.Now().Add(c.config.AccessTokenTTL)

	claims := &Claims{
		Email:    user.Email,
		Username: user.Username,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Subject:   user.ID.String(),
			ID:        uuid.New().String(),
		},
	}

	tokenString, err := c.jwt.GenerateJWTToken(claims)
	if err != nil {
		return "", time.Time{}, fmt.Errorf("failed to sign access token: %w", err)
	}

	return tokenString, expiresAt, nil
}

// GenerateRefreshToken creates a new JWT refresh token
func (c *Core) GenerateRefreshToken(ID uuid.UUID, user *userModel.User) (string, time.Time, error) {
	expiresAt := time.Now().Add(c.config.RefreshTokenTTL)
	claims := &Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Subject:   user.ID.String(),
			ID:        ID.String(),
		},
	}

	tokenString, err := c.jwt.GenerateJWTToken(claims)
	if err != nil {
		return "", time.Time{}, fmt.Errorf("failed to sign refresh token: %w", err)
	}

	return tokenString, expiresAt, nil
}
