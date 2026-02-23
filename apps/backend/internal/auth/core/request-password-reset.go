package core

import (
	"context"
	"fmt"
	"strings"
	"time"
)

// RequestPasswordReset sends a password reset email
func (c *Core) RequestPasswordReset(ctx context.Context, email string) error {
	email = strings.ToLower(strings.TrimSpace(email))

	user, err := c.user.GetUserByEmail(ctx, email)
	if err != nil {
		// Don't reveal if email exists or not
		return nil
	}

	if err := checkUserBan(user); err != nil {
		return err
	}

	// Generate reset token
	token, err := generateRandomToken(32)
	if err != nil {
		return fmt.Errorf("failed to generate token: %w", err)
	}

	expiresAt := time.Now().Add(1 * time.Hour)
	if err := c.storage.CreatePasswordResetToken(ctx, user.ID, token, expiresAt); err != nil {
		return fmt.Errorf("failed to create reset token: %w", err)
	}

	// TODO: Send email with reset link
	// For now, this is a placeholder. You would integrate with your email service here.

	return nil
}
