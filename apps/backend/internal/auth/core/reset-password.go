package core

import (
	"context"
	"fmt"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/food-swipe/internal/pkg/password"
)

// ResetPassword resets a user's password with the token
func (c *Core) ResetPassword(ctx context.Context, token, newPassword string) error {
	userID, expiresAt, used, err := c.storage.GetPasswordResetToken(ctx, token)
	if err != nil {
		return ErrInvalidToken
	}

	if used {
		return ErrTokenAlreadyUsed
	}

	if time.Now().After(expiresAt) {
		return ErrTokenExpired
	}

	provider, err := c.storage.GetUserAuthProviderByUserID(ctx, models.AuthProviderPassword, userID)
	if err != nil {
		return fmt.Errorf("failed to get user auth provider: %w", err)
	}

	// Hash new password
	passwordHash, err := password.Hash(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Mark token as used
	if err := c.storage.MarkPasswordResetTokenAsUsed(ctx, token); err != nil {
		return fmt.Errorf("failed to mark token as used: %w", err)
	}

	provider.Password = &passwordHash

	// Update password
	if err := c.storage.UpdateUserAuthProvider(ctx, provider.ID, provider); err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	// Revoke all refresh tokens for security
	_ = c.storage.RevokeAllUserRefreshTokens(ctx, userID)

	return nil
}
