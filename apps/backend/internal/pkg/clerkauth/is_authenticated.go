package clerkauth

import (
	"context"

	"github.com/msvdaamen/food-swipe/internal/pkg/auth"
)

func (a *Auth) IsAuthenticated(ctx context.Context, sessionToken string) (bool, error) {
	_, err := a.verifyJWT(ctx, sessionToken)
	if err != nil {
		return false, auth.ErrUnauthorized
	}

	return true, nil
}
