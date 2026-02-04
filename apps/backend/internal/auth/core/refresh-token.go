package core

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/google/uuid"
)

// RefreshToken generates a new access token from a refresh token
func (c *Core) RefreshToken(ctx context.Context, refreshToken string) (*models.TokenPair, error) {
	user, err := c.ValidateRefreshToken(ctx, refreshToken)
	if err != nil {
		return nil, ErrInvalidToken
	}

	// Check if user is banned
	if user.Banned {
		return nil, ErrUserBanned
	}

	// Generate new token pair
	tokenPair, err := c.generateTokenPair(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	// Revoke old refresh token
	_ = c.storage.RevokeRefreshToken(ctx, refreshToken)

	return tokenPair, nil
}

// generateTokenPair creates access and refresh tokens for a user
func (c *Core) generateTokenPair(ctx context.Context, user *models.User) (*models.TokenPair, error) {

	accessToken, expiresAt, err := c.GenerateAccessToken(user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate access token: %w", err)
	}

	// Generate refresh token
	refreshToken, refreshExpiresAt, err := c.GenerateRefreshToken(user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	// Store refresh token
	tokenHash := hashToken(refreshToken)
	storedToken := &models.RefreshToken{
		ID:        uuid.New(),
		UserID:    user.ID,
		TokenHash: tokenHash,
		ExpiresAt: refreshExpiresAt,
		Revoked:   false,
		CreatedAt: time.Now(),
	}

	if err := c.storage.CreateRefreshToken(ctx, storedToken); err != nil {
		return nil, fmt.Errorf("failed to store refresh token: %w", err)
	}

	return &models.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(time.Until(expiresAt).Seconds()),
	}, nil
}

// hashToken creates a SHA-256 hash of a token for secure storage
func hashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}
