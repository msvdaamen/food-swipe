package core

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/google/uuid"
)

// GetAuthUrl starts the OAuth flow with PKCE
func (c *Core) GetAuthUrl(ctx context.Context, provider models.AuthProvider, redirectURI string) (string, error) {
	// Get OAuth provider
	oauthProvider, ok := c.oauthProviders[provider]
	if !ok {
		return "", ErrProviderNotSupported
	}

	codeVerifier, codeChallenge, err := generatePKCEChallenge()
	if err != nil {
		return "", fmt.Errorf("failed to generate PKCE challenge: %w", err)
	}

	state, err := generateRandomToken(32)
	if err != nil {
		return "", fmt.Errorf("failed to generate state: %w", err)
	}

	oauthState := &models.OAuthState{
		ID:            uuid.New(),
		State:         state,
		CodeVerifier:  codeVerifier,
		CodeChallenge: codeChallenge,
		Provider:      provider,
		RedirectURI:   redirectURI,
		ExpiresAt:     time.Now().Add(10 * time.Minute),
		CreatedAt:     time.Now(),
	}

	if err := c.storage.CreateOAuthState(ctx, oauthState); err != nil {
		return "", fmt.Errorf("failed to store oauth state: %w", err)
	}

	authURL := oauthProvider.GetAuthorizationURL(state, codeChallenge, redirectURI)

	return authURL, nil
}

// generatePKCEChallenge generates a PKCE code verifier and challenge
func generatePKCEChallenge() (codeVerifier string, codeChallenge string, err error) {
	// Generate code verifier (43-128 characters)
	verifierBytes := make([]byte, 32)
	if _, err := rand.Read(verifierBytes); err != nil {
		return "", "", fmt.Errorf("failed to generate code verifier: %w", err)
	}
	codeVerifier = base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(verifierBytes)

	// Generate code challenge using S256 method
	hash := sha256.Sum256([]byte(codeVerifier))
	codeChallenge = base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(hash[:])

	return codeVerifier, codeChallenge, nil
}

// generateRandomToken generates a cryptographically secure random token
func generateRandomToken(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("failed to generate random token: %w", err)
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}
