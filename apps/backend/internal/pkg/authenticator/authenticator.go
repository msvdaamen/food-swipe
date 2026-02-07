package authenticator

import (
	"errors"

	jwtProvider "github.com/food-swipe/internal/pkg/jwt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

var ErrUnauthorized = errors.New("unauthorized")

type Provider struct {
	logger *zap.Logger
	jwt    *jwtProvider.Provider
}

func New(logger *zap.Logger, config Config) *Provider {
	jtwProvider := jwtProvider.New(jwtProvider.Config{
		Secret: config.JwtSecret,
	})
	return &Provider{
		logger: logger,
		jwt:    jtwProvider,
	}
}

func (a *Provider) Authenticate(token string) (*uuid.UUID, error) {
	claims := &jwt.RegisteredClaims{}
	err := a.jwt.ValidateToken(token, claims)
	if err != nil {
		return nil, ErrUnauthorized
	}
	userID, err := uuid.Parse(claims.Subject)
	if err != nil {
		return nil, ErrUnauthorized
	}
	return &userID, nil
}
