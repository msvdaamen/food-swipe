package core

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

// SendVerificationEmail sends a verification email to the user
func (c *Core) SendVerificationEmail(ctx context.Context, userID uuid.UUID) error {
	user, err := c.user.GetUserByID(ctx, userID)
	if err != nil {
		return ErrUserNotFound
	}

	if user.EmailVerified {
		return errors.New("email already verified")
	}

	// Generate verification token
	token, err := generateRandomToken(32)
	if err != nil {
		return fmt.Errorf("failed to generate token: %w", err)
	}

	expiresAt := time.Now().Add(24 * time.Hour)
	if err := c.storage.CreateEmailVerificationToken(ctx, userID, token, expiresAt); err != nil {
		return fmt.Errorf("failed to create verification token: %w", err)
	}

	// TODO: Send email with verification link
	// For now, this is a placeholder. You would integrate with your email service here.

	return nil
}
