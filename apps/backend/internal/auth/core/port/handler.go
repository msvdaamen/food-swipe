package port

import (
	"context"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/google/uuid"
)

type Handler interface {
	// Password-based authentication
	Register(ctx context.Context, email string, password string, username string, name string) (*models.AuthResponse, error)
	Login(ctx context.Context, email string, password string) (*models.AuthResponse, error)

	// Token management
	RefreshToken(ctx context.Context, refreshToken string) (*models.TokenPair, error)
	RevokeToken(ctx context.Context, refreshToken string) error
	RevokeAlltokens(ctx context.Context, userID uuid.UUID) error

	// OAuth flow
	GetAuthUrl(ctx context.Context, provider models.AuthProvider, redirectURI string) (string, error)
	ExchangeCode(ctx context.Context, code string, state string, provider models.AuthProvider) (*models.AuthResponse, error)

	// Token validation
	ValidateAccessToken(ctx context.Context, token string) (*uuid.UUID, error)

	// Email verification
	SendVerificationEmail(ctx context.Context, userID uuid.UUID) error
	VerifyEmail(ctx context.Context, token string) error

	// Password reset
	RequestPasswordReset(ctx context.Context, email string) error
	ResetPassword(ctx context.Context, token string, newPassword string) error

	// Change password
	ChangePassword(ctx context.Context, userID uuid.UUID, oldPassword string, newPassword string) error
}
