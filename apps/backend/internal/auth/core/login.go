package core

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/food-swipe/internal/pkg/password"
)

// Login authenticates a user with email and password
func (c *Core) Login(ctx context.Context, email, pass string) (*models.AuthResponse, error) {
	email = strings.ToLower(strings.TrimSpace(email))

	// Get user by email
	user, err := c.storage.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	// Check if user is banned
	if user.Banned {
		if user.BanExpires != nil && user.BanExpires.After(time.Now()) {
			return nil, fmt.Errorf("%w: banned until %s", ErrUserBanned, user.BanExpires.Format(time.RFC3339))
		} else if user.BanExpires == nil {
			return nil, fmt.Errorf("%w: permanently banned", ErrUserBanned)
		}
	}

	// Verify password
	if user.PasswordHash == nil {
		return nil, ErrInvalidCredentials
	}

	if err := password.Verify(pass, *user.PasswordHash); err != nil {
		return nil, ErrInvalidCredentials
	}

	// Check if password needs rehashing
	if password.NeedsRehash(*user.PasswordHash) {
		newHash, err := password.Hash(pass)
		if err == nil {
			_ = c.storage.UpdatePassword(ctx, user.ID, newHash)
		}
	}

	// Generate tokens
	tokenPair, err := c.generateTokenPair(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return &models.AuthResponse{
		User:      user,
		TokenPair: tokenPair,
	}, nil
}
