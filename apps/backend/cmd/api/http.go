package main

import (
	"context"

	"github.com/labstack/echo/v4"
	todoHttp "github.com/msvdaamen/food-swipe/internal/app/todo/adapter/primary/http"
	todoCore "github.com/msvdaamen/food-swipe/internal/app/todo/core"
	auth "github.com/msvdaamen/food-swipe/internal/pkg/auth/port"
	"github.com/msvdaamen/food-swipe/internal/pkg/http_server"
	"github.com/msvdaamen/food-swipe/internal/pkg/shutdown"
	"go.uber.org/zap"
)

func startHttpServer(
	logger *zap.Logger,
	shutdownManager *shutdown.Manager,
	config http_server.Config,
	auth auth.Port,
	todoCore *todoCore.Core,
) error {
	logger.Debug("Starting HTTP server")

	httpServer := http_server.New(logger, config)

	err := registerServices(logger, httpServer, auth, todoCore)
	if err != nil {
		return err
	}
	go func() {
		if err := httpServer.Start(":" + config.Port); err != nil {
			logger.Error("HTTP server failed to serve", zap.Error(err))
		}
	}()

	shutdownManager.SetTask("http", func() error {
		logger.Info("Shutting down HTTP server")
		httpServer.Shutdown(context.Background())

		return nil
	})

	logger.Info("HTTP server started", zap.String("address", httpServer.ListenerAddr().String()))

	return nil

}

// registerServices registers gRPC services to the server
func registerServices(
	logger *zap.Logger,
	httpServer *echo.Echo,
	auth auth.Port,
	todoCore *todoCore.Core,
) error {

	todoHttp.New(httpServer.Group("/todo"), todoCore, auth)
	logger.Info("Registering todo service")

	return nil
}
