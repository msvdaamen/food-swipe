package config

import (
	"crypto/rsa"
	"time"
)

type Config struct {
	JwtSecret string `env:"JWT_SECRET"`

	// JWT Configuration
	AccessTokenTTL  time.Duration `env:"ACCESS_TOKEN_TTL" env-default:"10m"`
	RefreshTokenTTL time.Duration `env:"REFRESH_TOKEN_TTL" env-default:"90d"`

	// Google OAuth
	GoogleClientID     string `env:"GOOGLE_CLIENT_ID"`
	GoogleClientSecret string `env:"GOOGLE_CLIENT_SECRET"`

	// Apple OAuth
	AppleClientID   string          `env:"APPLE_CLIENT_ID"`
	AppleTeamID     string          `env:"APPLE_TEAM_ID"`
	AppleKeyID      string          `env:"APPLE_KEY_ID"`
	ApplePrivateKey *rsa.PrivateKey `env:"APPLE_PRIVATE_KEY"`
}
