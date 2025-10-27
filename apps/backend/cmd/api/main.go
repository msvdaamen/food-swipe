package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/msvdaamen/food-swipe/internal/app"
	todoCore "github.com/msvdaamen/food-swipe/internal/app/todo/core"
	userStorage "github.com/msvdaamen/food-swipe/internal/app/user/adapters/secondary/storage"
	userCore "github.com/msvdaamen/food-swipe/internal/app/user/core"
	"github.com/msvdaamen/food-swipe/internal/pkg/clerkauth"
	"github.com/msvdaamen/food-swipe/internal/pkg/config"
	"github.com/msvdaamen/food-swipe/internal/pkg/logger"
	"github.com/msvdaamen/food-swipe/internal/pkg/postgres"
	"go.uber.org/zap"
)

func main() {
	_ = godotenv.Load()

	config, err := config.Load[app.Config]()
	if err != nil {
		log.Fatalf("Failed to load configuration: %s\n", err)
	}

	logger, err := logger.Setup(config.LogMode)
	if err != nil {
		panic(err)
	}
	defer logger.Sync() //nolint:errcheck

	logger.Info("Loaded configuration", zap.Any("config", config))

	postgresConnection, err := postgres.New(config.Database)
	if err != nil {
		logger.Error("Failed to connect to database", zap.Error(err))
	}

	userAdapter := userStorage.New(postgresConnection)

	authService := clerkauth.New(config.Auth, logger, postgresConnection, userAdapter)
	userService := userCore.New(userAdapter)

	todoService := todoCore.New(postgresConnection)

	err = startHttpServer(
		logger,
		config.Http,
		authService,
		userService,
		todoService,
	)
	if err != nil {
		logger.Error("Failed to start HTTP server", zap.Error(err))
	}

	logger.Info("Startup complete")

}
