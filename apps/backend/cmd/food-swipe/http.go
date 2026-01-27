package main

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"go.uber.org/zap"
)

type HttpServer struct {
	echo   *echo.Echo
	port   string
	Server *http.Server
	logger *zap.Logger
}

func setupHttpServer(port string, logger *zap.Logger) *HttpServer {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	s := http.Server{Addr: ":" + port, Handler: e}
	return &HttpServer{
		echo:   e,
		port:   port,
		Server: &s,
		logger: logger,
	}
}

func (h *HttpServer) Start() {
	go func() {
		h.logger.Info("Starting HTTP server on: " + h.port)
		if err := h.Server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("HTTP start error: %v", err)
		}
	}()
}

func (s *HttpServer) Shutdown(ctx context.Context) error {
	return s.Server.Shutdown(ctx)
}
