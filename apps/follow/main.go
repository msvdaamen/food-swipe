package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"connectrpc.com/connect"
	"connectrpc.com/grpcreflect"
	"connectrpc.com/validate"
	"github.com/food-swipe/follow/adapters/primary/grpc"
	"github.com/food-swipe/follow/adapters/secondary/storage"
	"github.com/food-swipe/follow/config"
	"github.com/food-swipe/follow/core"
	"github.com/food-swipe/gen/followers/v1/followersv1connect"
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	var cfg config.Config
	err := cleanenv.ReadConfig(".env", &cfg)
	if err != nil {
		log.Fatalf("Failed to read config: %v", err)
	}
	log.Println("Config loaded:", cfg)
	err, pool := initDatabaseConnection(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	storageAdapter := storage.New(pool)

	core := core.New(storageAdapter)

	grpcServer := grpc.New(core)
	mux := http.NewServeMux()
	reflector := grpcreflect.NewStaticReflector(
		"followers.v1.FollowerService",
	)
	mux.Handle(grpcreflect.NewHandlerV1(reflector))
	mux.Handle(grpcreflect.NewHandlerV1Alpha(reflector))
	path, handler := followersv1connect.NewFollowerServiceHandler(
		grpcServer,
		connect.WithInterceptors(validate.NewInterceptor()),
	)
	mux.Handle(path, handler)
	p := new(http.Protocols)
	p.SetHTTP1(true)
	p.SetUnencryptedHTTP2(true)
	server := http.Server{
		Addr:      "localhost:3000",
		Handler:   mux,
		Protocols: p,
	}
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

func initDatabaseConnection(url string) (error, *pgxpool.Pool) {
	conn, err := pgxpool.New(context.Background(), url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create connection pool: %v\n", err)
		os.Exit(1)
	}
	return err, conn
}
