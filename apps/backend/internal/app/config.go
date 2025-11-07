package app

import (
	"github.com/msvdaamen/food-swipe/internal/pkg/clerkauth"
	"github.com/msvdaamen/food-swipe/internal/pkg/grpc_server"
	"github.com/msvdaamen/food-swipe/internal/pkg/http_server"
	"github.com/msvdaamen/food-swipe/internal/pkg/logger"
	"github.com/msvdaamen/food-swipe/internal/pkg/postgres"
)

type Config struct {
	LogMode  logger.LogMode `env:"LOG_MODE" env-default:"0"`
	GRPC     grpc_server.Config
	Http     http_server.Config
	Database postgres.Config
	Auth     clerkauth.Config
}
