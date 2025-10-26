package clerkauth

import (
	"context"
	"errors"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/msvdaamen/food-swipe/internal/pkg/clerkauth/model"
)

var ErrInvalidToken = errors.New("error invalid token")

func (a *Auth) verifyJWT(ctx context.Context, sessionToken string) (*clerk.SessionClaims, error) {
	if sessionToken == "" {
		return nil, ErrInvalidToken
	}

	// Decode the session JWT to find the key ID
	unsafeClaims, err := jwt.Decode(ctx, &jwt.DecodeParams{
		Token: sessionToken,
	})
	if err != nil {
		return nil, ErrInvalidToken
	}

	// Fetch the JSON Web Key
	jwk, err := a.getJSONWebKey(ctx, unsafeClaims.KeyID)
	if err != nil {
		return nil, ErrInvalidToken
	}

	// Verify the session
	claims, err := jwt.Verify(ctx, &jwt.VerifyParams{
		Token:                   sessionToken,
		JWK:                     jwk,
		CustomClaimsConstructor: customClaimsConstructor,
	})
	if err != nil {
		return nil, ErrInvalidToken
	}
	return claims, nil
}

func customClaimsConstructor(ctx context.Context) any {
	return &model.CustomSessionClaims{}
}
