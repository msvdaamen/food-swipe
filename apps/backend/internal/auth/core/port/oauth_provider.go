package port

import (
	"context"

	"github.com/food-swipe/internal/auth/core/models"
)

// OAuthProvider defines the interface for OAuth provider implementations
type OAuthProvider interface {
	// GetAuthorizationURL generates the OAuth authorization URL with PKCE
	GetAuthorizationURL(state string, codeChallenge string, redirectURI string) string

	// ExchangeCode exchanges the authorization code for tokens
	ExchangeCode(ctx context.Context, code string, codeVerifier string, redirectURI string) (accessToken string, err error)

	// GetUserInfo retrieves user information from the OAuth provider
	GetUserInfo(ctx context.Context, accessToken string) (*models.OAuthUserInfo, error)

	// GetProviderName returns the name of the OAuth provider
	GetProviderName() models.AuthProvider
}
