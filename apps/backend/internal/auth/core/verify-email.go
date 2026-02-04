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

	// Update user email verified status
	if err := c.storage.UpdateEmailVerified(ctx, userID, true); err != nil {
		return fmt.Errorf("failed to update email verified status: %w", err)
	}

	return nil
}
