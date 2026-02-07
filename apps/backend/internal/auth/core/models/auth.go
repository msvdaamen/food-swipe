package models

import (
	"errors"
	"time"

	"github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

var (
	ErrUserProviderNotFound = errors.New("user provider not found")
)

type AuthProvider string

const (
	AuthProviderGoogle   AuthProvider = "google"
	AuthProviderApple    AuthProvider = "apple"
	AuthProviderPassword AuthProvider = "password"
)

type UserAuthProvider struct {
	ID             uuid.UUID
	UserID         uuid.UUID
	Provider       AuthProvider
	ProviderUserID string
	Password       *string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type RefreshToken struct {
	ID         uuid.UUID
	UserID     uuid.UUID
	ExpiresAt  time.Time
	RevokedAt  *time.Time
	DeviceInfo *string
	IPAddress  *string
	CreatedAt  time.Time
}

type TokenPair struct {
	AccessToken  string
	RefreshToken string
	ExpiresIn    time.Time
}

type AuthResponse struct {
	User      *models.User
	TokenPair *TokenPair
}
