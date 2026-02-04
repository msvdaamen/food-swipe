package core

import (
	"context"
)

// RevokeToken revokes a refresh token
func (c *Core) RevokeToken(ctx context.Context, refreshToken string) error {
	tokenHash := hashToken(refreshToken)
	return c.storage.RevokeRefreshToken(ctx, tokenHash)
}
