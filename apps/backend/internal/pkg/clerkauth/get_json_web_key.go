package clerkauth

import (
	"context"
	"errors"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
)

var ErrFailedToGetJSONWebKey = errors.New("failed to get JSON Web Key")

func (a *Auth) getJSONWebKey(ctx context.Context, keyId string) (*clerk.JSONWebKey, error) {

	if a.keyId != nil && a.jsonWebKey != nil && *a.keyId == keyId {
		return a.jsonWebKey, nil
	}

	// Fetch the JSON Web Key
	jwk, err := jwt.GetJSONWebKey(ctx, &jwt.GetJSONWebKeyParams{
		KeyID:      keyId,
		JWKSClient: a.jwtClient,
	})
	if err != nil {
		return nil, ErrFailedToGetJSONWebKey
	}
	a.jsonWebKey = jwk
	a.keyId = &keyId

	return jwk, nil
}
