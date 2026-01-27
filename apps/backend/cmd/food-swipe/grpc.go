package main

import (
	"context"
	"errors"
	"log"
	"net/http"

	"connectrpc.com/grpcreflect"
	"go.uber.org/zap"
)

type GrpcServer struct {
	Server *http.Server
	Mux    *http.ServeMux
	port   string
	logger *zap.Logger
}

func setupGrpcServer(port string, logger *zap.Logger) *GrpcServer {
	mux := http.NewServeMux()
	reflector := grpcreflect.NewStaticReflector(
		"followers.v1.FollowerService",
		"user.v1.UserService",
	)
	mux.Handle(grpcreflect.NewHandlerV1(reflector))
	mux.Handle(grpcreflect.NewHandlerV1Alpha(reflector))
	p := new(http.Protocols)
	p.SetHTTP1(true)
	p.SetUnencryptedHTTP2(true)
	server := &http.Server{
		Addr:      "localhost:" + port,
		Handler:   mux,
		Protocols: p,
	}
	return &GrpcServer{
		Server: server,
		Mux:    mux,
		port:   port,
		logger: logger,
	}
}

func (g *GrpcServer) Start() {
	go func() {
		g.logger.Info("Starting GRPC server on: " + g.port)
		if err := g.Server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("GRPC start error: %v", err)
		}
	}()
}

func (h *GrpcServer) Shutdown(ctx context.Context) error {
	return h.Server.Shutdown(ctx)
}

func (h *GrpcServer) Handle(path string, handler http.Handler) {
	h.Mux.Handle(path, handler)
}
