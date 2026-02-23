package core

import (
	"context"
	"fmt"
	"strings"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/food-swipe/internal/pkg/password"
)

// SignIn authenticates a user with email and password
func (c *Core) SignIn(ctx context.Context, email, pass string) (*models.AuthResponse, error) {
	email = strings.ToLower(strings.TrimSpace(email))

	// Get user by email
	user, err := c.user.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := checkUserBan(user); err != nil {
		return nil, err
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
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
	}, nil
}
