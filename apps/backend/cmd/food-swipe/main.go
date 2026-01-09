package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/food-swipe/internal/follow"
	"github.com/food-swipe/internal/pkg/logger"
	"github.com/food-swipe/internal/recipe"
	"github.com/food-swipe/internal/user"
	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	LogMode     logger.LogMode `env:"LOG_MODE" env-default:"0"`
	DatabaseURL string         `env:"DATABASE_URL"`
	NatsURL     string         `env:"NATS_URL"`
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

	mux, server := setupGrpcServer("3001")

	follow.Register(mux, pool, logger)
	user.Register(mux, pool, logger)
	recipe.Register(mux, pool, logger)

	shutdownChan := make(chan bool, 1)

	go func() {
		log.Println("Starting HTTP server on: ", server.Addr)
		if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("HTTP server error: %v", err)
		}
		log.Println("Stopped serving new connections.")
		shutdownChan <- true
	}()
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	shutdownCtx, shutdownRelease := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownRelease()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("HTTP shutdown error: %v", err)
	}

	<-shutdownChan
	log.Println("Graceful shutdown complete.")
}
