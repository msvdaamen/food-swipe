package core

import (
	"context"
	"fmt"
	"time"
)

// VerifyEmail verifies a user's email with the token
func (c *Core) VerifyEmail(ctx context.Context, token string) error {
	userID, expiresAt, used, err := c.storage.GetEmailVerificationToken(ctx, token)
	if err != nil {
		return ErrInvalidToken
	}

	if used {
		return ErrTokenAlreadyUsed
	}

	if time.Now().Unix() > expiresAt {
		return ErrTokenExpired
	}

	// Mark token as used
	if err := c.storage.MarkEmailVerificationTokenAsUsed(ctx, token); err != nil {
		return fmt.Errorf("failed to mark token as used: %w", err)
	}

	user, err := c.user.GetUserByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get user: %w", err)
	}

	user.EmailVerified = true

	if err := c.user.UpdateUser(ctx, userID, user); err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}
