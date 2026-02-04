package core

import (
	"context"
	"fmt"

	"github.com/google/uuid"
)

// RevokeAlltokens revokes all refresh tokens for a user
func (c *Core) RevokeAlltokens(ctx context.Context, userID string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	return c.storage.RevokeAllUserRefreshTokens(ctx, uid)
}
