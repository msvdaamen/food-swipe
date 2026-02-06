package models

import (
	"time"

	"github.com/google/uuid"
)

type AuthProviders string

const (
	AuthProvidersGoogle AuthProviders = "google"
	AuthProvidersApple  AuthProviders = "apple"
)

type User struct {
	ID              uuid.UUID
	Email           string
	EmailVerified   bool
	Username        string
	DisplayUsername *string
	Name            string
	PasswordHash    *string
	Image           *string
	Role            string
	Banned          bool
	BanReason       *string
	BanExpires      *time.Time
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

type AuthProvider struct {
	ID             uuid.UUID
	UserID         uuid.UUID
	Provider       string
	ProviderUserID string
	ProviderEmail  string
	AccessToken    *string
	RefreshToken   *string
	TokenExpiresAt *time.Time
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type RefreshToken struct {
	ID         uuid.UUID
	UserID     uuid.UUID
	TokenHash  string
	ExpiresAt  time.Time
	Revoked    bool
	RevokedAt  *time.Time
	DeviceInfo *string
	IPAddress  *string
	CreatedAt  time.Time
}

type OAuthState struct {
	ID            uuid.UUID
	State         string
	CodeVerifier  string
	CodeChallenge string
	Provider      string
	RedirectURI   string
	ExpiresAt     time.Time
	CreatedAt     time.Time
}

type TokenPair struct {
	AccessToken  string
	RefreshToken string
	ExpiresIn    int64
}

type AuthResponse struct {
	User      *User
	TokenPair *TokenPair
}
