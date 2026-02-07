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
	user, err := c.user.GetUserByEmail(ctx, email)
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

	// Get user auth provider by user ID
	provider, err := c.storage.GetUserAuthProviderByUserID(ctx, models.AuthProviderPassword, user.ID)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := password.Verify(pass, *provider.Password); err != nil {
		return nil, ErrInvalidCredentials
	}

	// Check if password needs rehashing
	if password.NeedsRehash(*provider.Password) {
		newHash, err := password.Hash(pass)
		if err == nil {
			provider.Password = &newHash
			_ = c.storage.UpdateUserAuthProvider(ctx, provider.ID, provider)
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
