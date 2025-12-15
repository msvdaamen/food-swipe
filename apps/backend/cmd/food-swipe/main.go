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
)

type Config struct {
	DatabaseURL string
}

func main() {
	cfg := Config{
		DatabaseURL: "postgres://user:password@localhost:5432/dbname",
	}

	err, pool := setupDatabaseConnection(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	mux, server := setupGrpcServer("3000")

	follow.Register(mux, pool)

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
