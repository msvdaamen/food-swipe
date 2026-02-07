package models

import (
	"time"

	"github.com/google/uuid"
)

type OAuthProvider struct {
	Name         string
	ClientID     string
	ClientSecret string
	RedirectURL  string
	AuthURL      string
	TokenURL     string
	UserInfoURL  string
	Scopes       []string
}

type OAuthUserInfo struct {
	ProviderUserID string
	Email          string
	EmailVerified  bool
	Name           string
	Picture        *string
}

type OAuthState struct {
	ID            uuid.UUID
	State         string
	CodeVerifier  string
	CodeChallenge string
	Provider      AuthProvider
	RedirectURI   string
	ExpiresAt     time.Time
	CreatedAt     time.Time
}
