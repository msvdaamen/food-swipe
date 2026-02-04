package port

import (
	"context"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/google/uuid"
)

type Storage interface {
	// User operations
	CreateUser(ctx context.Context, user *models.User) error
	GetUserByID(ctx context.Context, userID uuid.UUID) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
	GetUserByUsername(ctx context.Context, username string) (*models.User, error)
	UpdateUser(ctx context.Context, user *models.User) error
	UpdatePassword(ctx context.Context, userID uuid.UUID, passwordHash string) error
	UpdateEmailVerified(ctx context.Context, userID uuid.UUID, verified bool) error
	UpdateUsername(ctx context.Context, userID uuid.UUID, username string) error
	UpdateDisplayUsername(ctx context.Context, userID uuid.UUID, displayUsername *string) error

	// Auth provider operations
	CreateAuthProvider(ctx context.Context, provider *models.AuthProvider) error
	GetAuthProviderByProviderUserID(ctx context.Context, provider, providerUserID string) (*models.AuthProvider, error)
	GetAuthProvidersByUserID(ctx context.Context, userID uuid.UUID) ([]*models.AuthProvider, error)
	UpdateAuthProvider(ctx context.Context, provider *models.AuthProvider) error

	// Refresh token operations
	CreateRefreshToken(ctx context.Context, token *models.RefreshToken) error
	GetRefreshTokenByHash(ctx context.Context, tokenHash string) (*models.RefreshToken, error)
	RevokeRefreshToken(ctx context.Context, tokenHash string) error
	RevokeAllUserRefreshTokens(ctx context.Context, userID uuid.UUID) error
	DeleteExpiredRefreshTokens(ctx context.Context) error

	// OAuth state operations
	CreateOAuthState(ctx context.Context, state *models.OAuthState) error
	GetOAuthStateByState(ctx context.Context, state string) (*models.OAuthState, error)
	DeleteOAuthState(ctx context.Context, state string) error
	DeleteExpiredOAuthStates(ctx context.Context) error

	// Email verification operations
	CreateEmailVerificationToken(ctx context.Context, userID uuid.UUID, token string, expiresAt int64) error
	GetEmailVerificationToken(ctx context.Context, token string) (userID uuid.UUID, expiresAt int64, used bool, err error)
	MarkEmailVerificationTokenAsUsed(ctx context.Context, token string) error

	// Password reset operations
	CreatePasswordResetToken(ctx context.Context, userID uuid.UUID, token string, expiresAt int64) error
	GetPasswordResetToken(ctx context.Context, token string) (userID uuid.UUID, expiresAt int64, used bool, err error)
	MarkPasswordResetTokenAsUsed(ctx context.Context, token string) error
}
