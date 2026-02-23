package core

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	userModel "github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

// HandleOAuthCallback handles the OAuth callback and creates or logs in the user
func (c *Core) ExchangeCode(ctx context.Context, code string, state string, provider models.AuthProvider) (*models.AuthResponse, error) {
	now := time.Now()
	oauthProvider, ok := c.oauthProviders[provider]
	if !ok {
		return nil, ErrProviderNotSupported
	}

	oauthState, err := c.storage.GetOAuthStateByState(ctx, state)
	if err != nil {
		return nil, ErrInvalidOAuthState
	}

	if oauthState.ExpiresAt.Before(time.Now()) {
		_ = c.storage.DeleteOAuthState(ctx, state)
		return nil, ErrOAuthStateExpired
	}

	if oauthState.Provider != provider {
		return nil, ErrInvalidOAuthState
	}

	_ = c.storage.DeleteOAuthState(ctx, state)

	accessToken, err := oauthProvider.ExchangeCode(ctx, code, oauthState.CodeVerifier, oauthState.RedirectURI)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange code: %w", err)
	}

	userInfo, err := oauthProvider.GetUserInfo(ctx, accessToken)
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %w", err)
	}

	existingProvider, err := c.storage.GetUserAuthProviderByProviderUserID(ctx, provider, userInfo.ProviderUserID)
	if err != nil && !errors.Is(err, models.ErrUserProviderNotFound) {
		return nil, fmt.Errorf("failed to get auth provider: %w", err)
	}

	if existingProvider != nil {
		user, err := c.user.GetUserByID(ctx, existingProvider.UserID)
		if err != nil {
			return nil, fmt.Errorf("failed to get user: %w", err)
		}

		if err := checkUserBan(user); err != nil {
			return nil, err
		}

		tokenPair, err := c.generateTokenPair(ctx, user)
		if err != nil {
			return nil, fmt.Errorf("failed to generate tokens: %w", err)
		}

		return &models.AuthResponse{
			AccessToken:  tokenPair.AccessToken,
			RefreshToken: tokenPair.RefreshToken,
		}, nil
	}

	user, err := c.user.GetUserByEmail(ctx, userInfo.Email)
	if err != nil && user != nil {
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}
	if user == nil {
		username := c.generateUsernameFromEmail(ctx, userInfo.Email)
		now := time.Now()
		user = &userModel.User{
			Email:           userInfo.Email,
			EmailVerified:   true,
			Username:        username,
			DisplayUsername: username,
			Name:            userInfo.Name,
			Image:           userInfo.Picture,
			Role:            "user",
			Banned:          false,
			CreatedAt:       now,
			UpdatedAt:       now,
		}
		user, err = c.user.CreateUser(ctx, user)

		if err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
	}

	ID, err := uuid.NewV7()
	if err != nil {
		return nil, fmt.Errorf("failed to generate UUID: %w", err)
	}
	authProvider := &models.UserAuthProvider{
		ID:             ID,
		UserID:         user.ID,
		Provider:       provider,
		ProviderUserID: &userInfo.ProviderUserID,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	if err := c.storage.CreateUserAuthProvider(ctx, authProvider); err != nil {
		return nil, fmt.Errorf("failed to link oauth provider: %w", err)
	}

	tokenPair, err := c.generateTokenPair(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return &models.AuthResponse{
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
	}, nil
}

func (c *Core) generateUsernameFromEmail(ctx context.Context, email string) string {
	parts := strings.Split(email, "@")
	if len(parts) == 0 {
		parts = []string{"user"}
	}
	baseUsername := strings.ToLower(parts[0])

	baseUsername = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			return r
		}
		return -1
	}, baseUsername)

	if baseUsername == "" {
		baseUsername = "user"
	}

	username := baseUsername
	counter := 1
	for {
		_, err := c.user.GetUserByUsername(ctx, username)
		if err != nil {
			break
		}
		username = fmt.Sprintf("%s%d", baseUsername, counter)
		counter++
	}

	return username
}
