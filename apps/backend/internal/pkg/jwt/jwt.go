package jwt

import "go.uber.org/zap"

type JWT struct {
	secret string
	logger *zap.Logger
}

func New(secret string, logger *zap.Logger) *JWT {
	return &JWT{
		secret: secret,
	}
}
