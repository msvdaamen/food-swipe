package main

import (
	"context"
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
	"github.com/msvdaamen/food-swipe/internal/pkg/shutdown"
	"go.uber.org/zap"
)

func main() {
	ctx := context.Background()
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

	shutdownManager, shutdownCompleteChannel := shutdown.New(ctx, logger)
	defer shutdownManager.Shutdown(nil)

	postgresConnection, err := postgres.New(config.Database)
	if err != nil {
		logger.Error("Failed to connect to database", zap.Error(err))
		shutdownManager.Shutdown(err)
	}

	userAdapter := userStorage.New(postgresConnection)

	authService := clerkauth.New(config.Auth, logger, postgresConnection, userAdapter)
	userService := userCore.New(userAdapter)

	todoService := todoCore.New(postgresConnection)

	err = startgRPCServer(logger, shutdownManager, config.GRPC, authService, todoService, userService)
	if err != nil {
		logger.Error("Failed to start gRPC server", zap.Error(err))
		shutdownManager.Shutdown(err)
	}

	logger.Info("Startup complete")

	// Wait for shutdown to complete
	<-shutdownCompleteChannel
}
