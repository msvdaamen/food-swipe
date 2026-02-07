package core

import (
	"context"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/auth/core/models"

	"github.com/food-swipe/internal/pkg/password"
	"github.com/google/uuid"
)

// ChangePassword changes a user's password
func (c *Core) ChangePassword(ctx context.Context, userID uuid.UUID, oldPassword string, newPassword string) error {
	user, err := c.user.GetUserByID(ctx, userID)
	if err != nil {
		return ErrUserNotFound
	}

	provider, err := c.storage.GetUserAuthProviderByUserID(ctx, models.AuthProviderPassword, user.ID)
	if err != nil {
		return fmt.Errorf("failed to get user auth provider: %w", err)
	}

	// Verify old password
	if provider.Password == nil {
		return errors.New("user does not have a password set")
	}

	if err := password.Verify(oldPassword, *provider.Password); err != nil {
		return ErrInvalidCredentials
	}

	// Hash new password
	passwordHash, err := password.Hash(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
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
