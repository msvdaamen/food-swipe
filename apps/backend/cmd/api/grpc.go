package main

import (
	"context"
	"fmt"
	"net/http"

	"connectrpc.com/connect"
	"github.com/msvdaamen/food-swipe/gen/api/v1/apiv1connect"
	todoCore "github.com/msvdaamen/food-swipe/internal/app/todo/core"
	userGrpc "github.com/msvdaamen/food-swipe/internal/app/user/adapters/primary/grpc"
	userCore "github.com/msvdaamen/food-swipe/internal/app/user/core"
	"github.com/msvdaamen/food-swipe/internal/pkg/auth"
	"github.com/msvdaamen/food-swipe/internal/pkg/grpc_server"
	"github.com/msvdaamen/food-swipe/internal/pkg/shutdown"
	"go.uber.org/zap"
)

// startgRPCServer starts the gRPC server and register gRPC services
func startgRPCServer(
	logger *zap.Logger,
	shutdownManager *shutdown.Manager,
	config grpc_server.Config,
	auth auth.Auth,
	todoCore *todoCore.Core,
	userCore *userCore.Core,
) error {
	logger.Debug("Starting gRPC server")

	httpServer, mux, interceptors, err := grpc_server.New(logger, config)
	if err != nil {
		return fmt.Errorf("failed to create gRPC server: %w", err)
	}

	err = registerServices2(logger, mux, *interceptors, auth, todoCore, userCore)
	if err != nil {
		return err
	}
	go func() {
		if err := httpServer.ListenAndServe(); err != nil {
			logger.Error("gRPC server failed to serve", zap.Error(err))
		}
	}()

	shutdownManager.SetTask("grpc", func() error {
		logger.Info("Shutting down gRPC server")
		httpServer.Shutdown(context.Background())

		return nil
	})

	logger.Info("gRPC server started", zap.String("address", httpServer.Addr))

	return nil

}

// registerServices registers gRPC services to the server
func registerServices2(
	logger *zap.Logger,
	grpcServer *http.ServeMux,
	interceptors connect.Option,
	auth auth.Auth,
	todoCore *todoCore.Core,
	userCore *userCore.Core,
) error {

	userGrpcAdapter := userGrpc.New(userCore)
	grpcServer.Handle(apiv1connect.NewUserServiceHandler(userGrpcAdapter, interceptors))

	return nil
}
