package grpc_server

import (
	"net/http"

	"connectrpc.com/connect"
	"connectrpc.com/grpcreflect"
	"connectrpc.com/validate"
	"go.uber.org/zap"
)

// New creates a new gRPC server with logging and healthchecks
func New(logger *zap.Logger, config Config) (*http.Server, *http.ServeMux, *connect.Option, error) {
	mux := http.NewServeMux()
	reflector := grpcreflect.NewStaticReflector(
		"api.v1.UserService",
	)
	mux.Handle(grpcreflect.NewHandlerV1(reflector))
	mux.Handle(grpcreflect.NewHandlerV1Alpha(reflector))
	interceptors := connect.WithInterceptors(
		validate.NewInterceptor(),
		InterceptorLogger(logger),
	)
	p := new(http.Protocols)
	p.SetHTTP1(true)
	p.SetUnencryptedHTTP2(true)

	// middleware := authn.NewMiddleware(authenticate)
	// handler := middleware.Wrap(mux)
	httpServer := http.Server{
		Addr:      "localhost:8080",
		Handler:   withCORS(mux),
		Protocols: p,
	}

	return &httpServer, mux, &interceptors, nil
}
