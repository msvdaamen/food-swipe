package core

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/google/uuid"
)

// HandleOAuthCallback handles the OAuth callback and creates or logs in the user
func (c *Core) ExchangeCode(ctx context.Context, code string, state string, provider string) (*models.AuthResponse, error) {
	// Get OAuth provider
	oauthProvider, ok := c.oauthProviders[provider]
	if !ok {
		return nil, ErrProviderNotSupported
	}

	// Get OAuth state
	oauthState, err := c.storage.GetOAuthStateByState(ctx, state)
	if err != nil {
		return nil, ErrInvalidOAuthState
	}

	// Check if state has expired
	if oauthState.ExpiresAt.Before(time.Now()) {
		_ = c.storage.DeleteOAuthState(ctx, state)
		return nil, ErrOAuthStateExpired
	}

	// Check if provider matches
	if oauthState.Provider != provider {
		return nil, ErrInvalidOAuthState
	}

	// Delete OAuth state (one-time use)
	_ = c.storage.DeleteOAuthState(ctx, state)

	// Exchange code for tokens
	accessToken, refreshToken, expiresIn, err := oauthProvider.ExchangeCode(ctx, code, oauthState.CodeVerifier, oauthState.RedirectURI)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code: %w", err)
	}

	// Get user info from provider
	userInfo, err := oauthProvider.GetUserInfo(ctx, accessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	// Check if user already exists with this provider
	existingProvider, err := c.storage.GetAuthProviderByProviderUserID(ctx, provider, userInfo.ProviderUserID)
	if err == nil && existingProvider != nil {
		// User exists, log them in
		user, err := c.storage.GetUserByID(ctx, existingProvider.UserID)
		if err != nil {
			return nil, fmt.Errorf("failed to get user: %w", err)
		}

		// Check if user is banned
		if user.Banned {
			return nil, ErrUserBanned
		}

		// Update provider tokens
		existingProvider.AccessToken = &accessToken
		existingProvider.RefreshToken = &refreshToken
		tokenExpiresAt := time.Now().Add(time.Duration(expiresIn) * time.Second)
		existingProvider.TokenExpiresAt = &tokenExpiresAt
		_ = c.storage.UpdateAuthProvider(ctx, existingProvider)

		// Generate our own tokens
		tokenPair, err := c.generateTokenPair(ctx, user)
		if err != nil {
			return nil, fmt.Errorf("failed to generate tokens: %w", err)
		}

		return &models.AuthResponse{
			User:      user,
			TokenPair: tokenPair,
		}, nil
	}

	// Check if user exists by email
	var user *models.User
	existingUser, err := c.storage.GetUserByEmail(ctx, userInfo.Email)
	if err == nil && existingUser != nil {
		// User exists with this email, link the provider
		user = existingUser

		// Update email verified if provider says it's verified
		if userInfo.EmailVerified && !user.EmailVerified {
			_ = c.storage.UpdateEmailVerified(ctx, user.ID, true)
			user.EmailVerified = true
		}
	} else {
		// Create new user
		username := c.generateUsernameFromEmail(ctx, userInfo.Email)
		user = &models.User{
			ID:            uuid.New(),
			Email:         userInfo.Email,
			EmailVerified: userInfo.EmailVerified,
			Username:      username,
			Name:          userInfo.Name,
			Image:         &userInfo.Picture,
			Role:          "user",
			Banned:        false,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		if err := c.storage.CreateUser(ctx, user); err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
	}

	// Link OAuth provider to user
	tokenExpiresAt := time.Now().Add(time.Duration(expiresIn) * time.Second)
	authProvider := &models.AuthProvider{
		ID:             uuid.New(),
		UserID:         user.ID,
		Provider:       provider,
		ProviderUserID: userInfo.ProviderUserID,
		ProviderEmail:  userInfo.Email,
		AccessToken:    &accessToken,
		RefreshToken:   &refreshToken,
		TokenExpiresAt: &tokenExpiresAt,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	if err := c.storage.CreateAuthProvider(ctx, authProvider); err != nil {
		return nil, fmt.Errorf("failed to link oauth provider: %w", err)
	}

	// Generate our own tokens
	tokenPair, err := c.generateTokenPair(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return &models.AuthResponse{
		User:      user,
		TokenPair: tokenPair,
	}, nil
}

// generateUsernameFromEmail creates a unique username from an email address
func (c *Core) generateUsernameFromEmail(ctx context.Context, email string) string {
	// Extract username from email
	parts := strings.Split(email, "@")
	if len(parts) == 0 {
		parts = []string{"user"}
	}
	baseUsername := strings.ToLower(parts[0])

	// Clean username (remove special characters)
	baseUsername = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			return r
		}
		return -1
	}, baseUsername)

	if baseUsername == "" {
		baseUsername = "user"
	}

	// Check if username exists
	username := baseUsername
	counter := 1
	for {
		_, err := c.storage.GetUserByUsername(ctx, username)
		if err != nil {
			// Username is available
			break
		}
		// Try with number suffix
		username = fmt.Sprintf("%s%d", baseUsername, counter)
		counter++
	}

	return username
}
