package core

import (
	"context"
	"fmt"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	userModel "github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

// RefreshToken generates a new access token from a refresh token
func (c *Core) RefreshToken(ctx context.Context, refreshToken string) (*models.TokenPair, error) {
	refreshTokenModel, user, err := c.ValidateRefreshToken(ctx, refreshToken)
	if err != nil {
		return nil, ErrInvalidToken
	}

	if err := checkUserBan(user); err != nil {
		return nil, err
	}

	// Generate new token pair
	tokenPair, err := c.generateTokenPair(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	// Revoke old refresh token
	_ = c.storage.RevokeRefreshToken(ctx, refreshTokenModel.ID)

	return tokenPair, nil
}

// generateTokenPair creates access and refresh tokens for a user
func (c *Core) generateTokenPair(ctx context.Context, user *userModel.User) (*models.TokenPair, error) {

	accessToken, err := c.GenerateAccessToken(user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate access token: %w", err)
	}

	refreshTokenID, err := uuid.NewV7()
	if err != nil {
		return nil, fmt.Errorf("failed to generate UUID: %w", err)
	}

	refreshToken, refreshExpiresAt, err := c.GenerateRefreshToken(refreshTokenID, user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	storedToken := &models.RefreshToken{
		ID:        refreshTokenID,
		UserID:    user.ID,
		ExpiresAt: refreshExpiresAt,
		CreatedAt: time.Now(),
	}

	if err := c.storage.CreateRefreshToken(ctx, storedToken); err != nil {
		return nil, fmt.Errorf("failed to store refresh token: %w", err)
	}

	return &models.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}
