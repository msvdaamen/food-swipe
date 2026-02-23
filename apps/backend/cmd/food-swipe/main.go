package main

import (
	"context"
	"log"
	"os/signal"
	"syscall"
	"time"

	"github.com/food-swipe/internal/auth"
	authConfig "github.com/food-swipe/internal/auth/config"
	"github.com/food-swipe/internal/follow"
	"github.com/food-swipe/internal/pkg/authenticator"
	filestorage "github.com/food-swipe/internal/pkg/file-storage"
	"github.com/food-swipe/internal/pkg/i18n"
	"github.com/food-swipe/internal/pkg/logger"
	"github.com/food-swipe/internal/recipe"
	"github.com/food-swipe/internal/user"
	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	LogMode       logger.LogMode `env:"LOG_MODE" env-default:"0"`
	DatabaseURL   string         `env:"DATABASE_URL"`
	NatsURL       string         `env:"NATS_URL"`
	FileStorage   filestorage.Config
	Port          string `env:"PORT" env-default:"3000"`
	GrpcPort      string `env:"GRPC_PORT" env-default:"3001"`
	Auth          authConfig.Config
	Authenticator authenticator.Config
}

func main() {
	var cfg Config
	err := cleanenv.ReadConfig(".env", &cfg)
	if err != nil {
		log.Fatalf("Failed to read environment variables: %v", err)
	}

	logger, err := logger.Setup(cfg.LogMode)
	if err != nil {
		panic(err)
	}
	defer logger.Sync()

	pool, err := setupDatabaseConnection(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	nc, err := setupNatsConnection(cfg.NatsURL)
	if err != nil {
		log.Fatalf("Failed to connect to NATS: %v", err)
	}
	defer nc.Close()

	fileStorage := filestorage.New(&cfg.FileStorage)

	i18nProvider := i18n.New()

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	grpcServer := setupGrpcServer(cfg.GrpcPort, logger)
	httpServer := setupHttpServer(cfg.Port, i18nProvider, logger)

	authenticator := authenticator.New(logger, cfg.Authenticator)

	auth.Register(httpServer.Echo, pool, authenticator, cfg.Auth, logger)
	follow.Register(grpcServer, pool, logger)
	user.Register(grpcServer, httpServer.Echo, pool, authenticator, logger)
	recipe.Register(grpcServer, pool, fileStorage, logger)

	httpServer.Start()
	grpcServer.Start()

	<-ctx.Done()
	// To allow force close
	stop()
	logger.Info("Received shutdown signal, shutting down.")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	err = httpServer.Shutdown(shutdownCtx)
	if err != nil {
		log.Printf("Failed to shutdown HTTP server: %v", err)
	}

	err = grpcServer.Shutdown(shutdownCtx)
	if err != nil {
		log.Printf("Failed to shutdown gRPC server: %v", err)
	}

	logger.Info("Server shut down gracefully.")
}
