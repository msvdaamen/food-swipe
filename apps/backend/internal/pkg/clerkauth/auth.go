package clerkauth

import (
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwks"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/msvdaamen/food-swipe/internal/pkg/clerkauth/port"
	"go.uber.org/zap"
)

type Auth struct {
	publishableKey string
	secretKey      string
	jwtClient      *jwks.Client
	keyId          *string
	jsonWebKey     *clerk.JSONWebKey
	logger         *zap.Logger
	database       *pgxpool.Pool
	user           port.User
}

func New(config Config, logger *zap.Logger, database *pgxpool.Pool, user port.User) *Auth {
	clerk.SetKey(config.SecretKey)
	jwtClientConfig := &clerk.ClientConfig{}
	jwtClientConfig.Key = &config.SecretKey
	jwksClient := jwks.NewClient(jwtClientConfig)

	return &Auth{
		publishableKey: config.PublishableKey,
		secretKey:      config.SecretKey,
		jwtClient:      jwksClient,
		logger:         logger,
		database:       database,
		user:           user,
	}
}
