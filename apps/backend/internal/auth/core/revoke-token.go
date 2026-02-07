package core

import (
	"context"
)

// RevokeToken revokes a refresh token
func (c *Core) RevokeToken(ctx context.Context, refreshToken string) error {
	refreshTokenModel, _, err := c.ValidateRefreshToken(ctx, refreshToken)
	if err != nil {
		return ErrInvalidToken
	}
	return c.storage.RevokeRefreshToken(ctx, refreshTokenModel.ID)
}
