package port

import (
	"context"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/google/uuid"
)

type Storage interface {
	// Auth provider operations
	CreateUserAuthProvider(ctx context.Context, provider *models.UserAuthProvider) error
	GetUserAuthProviderByProviderUserID(ctx context.Context, provider models.AuthProvider, providerUserID string) (*models.UserAuthProvider, error)
	GetUserAuthProviderByUserID(ctx context.Context, provider models.AuthProvider, userID uuid.UUID) (*models.UserAuthProvider, error)
	GetUserAuthProvidersByUserID(ctx context.Context, userID uuid.UUID) ([]*models.UserAuthProvider, error)
	UpdateUserAuthProvider(ctx context.Context, ID uuid.UUID, provider *models.UserAuthProvider) error

	// Refresh token operations
	CreateRefreshToken(ctx context.Context, token *models.RefreshToken) error
	GetRefreshTokenByID(ctx context.Context, ID uuid.UUID) (*models.RefreshToken, error)
	RevokeRefreshToken(ctx context.Context, ID uuid.UUID) error
	RevokeAllUserRefreshTokens(ctx context.Context, userID uuid.UUID) error
	DeleteExpiredRefreshTokens(ctx context.Context) error

	// OAuth state operations
	CreateOAuthState(ctx context.Context, state *models.OAuthState) error
	GetOAuthStateByState(ctx context.Context, state string) (*models.OAuthState, error)
	DeleteOAuthState(ctx context.Context, state string) error
	DeleteExpiredOAuthStates(ctx context.Context) error

	// Email verification operations
	CreateEmailVerificationToken(ctx context.Context, userID uuid.UUID, token string, expiresAt time.Time) error
	GetEmailVerificationToken(ctx context.Context, token string) (userID uuid.UUID, expiresAt time.Time, used bool, err error)
	MarkEmailVerificationTokenAsUsed(ctx context.Context, token string) error

	// Password reset operations
	CreatePasswordResetToken(ctx context.Context, userID uuid.UUID, token string, expiresAt time.Time) error
	GetPasswordResetToken(ctx context.Context, token string) (userID uuid.UUID, expiresAt time.Time, used bool, err error)
	MarkPasswordResetTokenAsUsed(ctx context.Context, token string) error
}
