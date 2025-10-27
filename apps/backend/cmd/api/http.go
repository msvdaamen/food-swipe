package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	todoHttp "github.com/msvdaamen/food-swipe/internal/app/todo/adapter/primary/http"
	todoCore "github.com/msvdaamen/food-swipe/internal/app/todo/core"
	userHttp "github.com/msvdaamen/food-swipe/internal/app/user/adapters/secondary/primary/http"
	userCore "github.com/msvdaamen/food-swipe/internal/app/user/core"
	"github.com/msvdaamen/food-swipe/internal/pkg/auth"
	"github.com/msvdaamen/food-swipe/internal/pkg/http_server"
	"go.uber.org/zap"
)

func startHttpServer(
	logger *zap.Logger,
	config http_server.Config,
	auth auth.Auth,
	userCore *userCore.Core,
	todoCore *todoCore.Core,
) error {
	logger.Debug("Starting HTTP server")

	httpServer := http_server.New(logger, config)

	err := registerServices(logger, httpServer, auth, userCore, todoCore)
	if err != nil {
		return err
	}

	if err := httpServer.Start(":" + config.Port); err != nil && err != http.ErrServerClosed {
		logger.Error("HTTP server failed to serve", zap.Error(err))
	}

	logger.Info("HTTP server started", zap.String("address", httpServer.ListenerAddr().String()))

	return nil

}

// registerServices registers gRPC services to the server
func registerServices(
	logger *zap.Logger,
	httpServer *echo.Echo,
	auth auth.Auth,
	userCore *userCore.Core,
	todoCore *todoCore.Core,
) error {

	userHttp.New(httpServer, userCore, auth)
	logger.Info("Registering user service")
	todoHttp.New(httpServer, todoCore, auth)
	logger.Info("Registering todo service")

	return nil
}
