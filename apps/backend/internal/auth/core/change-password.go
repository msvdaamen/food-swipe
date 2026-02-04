package core

import (
	"context"
	"errors"
	"fmt"

	"github.com/food-swipe/internal/pkg/password"
	"github.com/google/uuid"
)

// ChangePassword changes a user's password
func (c *Core) ChangePassword(ctx context.Context, userID, oldPassword, newPassword string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	user, err := c.storage.GetUserByID(ctx, uid)
	if err != nil {
		return ErrUserNotFound
	}

	// Verify old password
	if user.PasswordHash == nil {
		return errors.New("user does not have a password set")
	}

	if err := password.Verify(oldPassword, *user.PasswordHash); err != nil {
		return ErrInvalidCredentials
	}

	// Hash new password
	passwordHash, err := password.Hash(newPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	// Update password
	if err := c.storage.UpdatePassword(ctx, uid, passwordHash); err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}

	// Revoke all refresh tokens for security
	_ = c.storage.RevokeAllUserRefreshTokens(ctx, uid)

	return nil
}
