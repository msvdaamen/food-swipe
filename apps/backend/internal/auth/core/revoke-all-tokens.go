package core

import (
	"context"

	"github.com/google/uuid"
)

// RevokeAlltokens revokes all refresh tokens for a user
func (c *Core) RevokeAlltokens(ctx context.Context, userID uuid.UUID) error {
	return c.storage.RevokeAllUserRefreshTokens(ctx, userID)
}
