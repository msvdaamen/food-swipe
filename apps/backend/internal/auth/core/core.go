package core

import (
	"errors"
	"fmt"
	"time"

	"github.com/food-swipe/internal/auth/config"
	"github.com/food-swipe/internal/auth/core/models"
	"github.com/food-swipe/internal/auth/core/port"
	"github.com/food-swipe/internal/pkg/jwt"
	userModels "github.com/food-swipe/internal/user/core/models"
)

var (
	ErrInvalidCredentials    = errors.New("invalid credentials")
	ErrUserAlreadyExists     = errors.New("user already exists")
	ErrUsernameAlreadyExists = errors.New("username already exists")
	ErrUserNotFound          = errors.New("user not found")
	ErrTokenExpired          = errors.New("token has expired")
	ErrTokenAlreadyUsed      = errors.New("token has already been used")
	ErrInvalidOAuthState     = errors.New("invalid oauth state")
	ErrOAuthStateExpired     = errors.New("oauth state has expired")
	ErrProviderNotSupported  = errors.New("oauth provider not supported")
	ErrUserBanned            = errors.New("user is banned")
	ErrEmailNotVerified      = errors.New("email not verified")
	ErrInvalidProvider       = errors.New("invalid provider configuration")
)

type Core struct {
	config         config.Config
	storage        port.Storage
	jwt            *jwt.Provider
	oauthProviders map[models.AuthProvider]port.OAuthProvider
	user           port.User
}

func New(storage port.Storage, oauthProviders map[models.AuthProvider]port.OAuthProvider, user port.User, config config.Config) *Core {
	return &Core{
		config:  config,
		storage: storage,
		jwt: jwt.New(jwt.Config{
			Secret: config.JwtSecret,
		}),
		oauthProviders: oauthProviders,
		user:           user,
	}
}

func checkUserBan(user *userModels.User) error {
	if user.Banned {
		if user.BanExpires == nil {
			return ErrUserBanned
		}
		if user.BanExpires.After(time.Now()) {
			return fmt.Errorf("%w: banned until %s", ErrUserBanned, user.BanExpires.Format(time.RFC3339))
		}
	}
	return nil
}
