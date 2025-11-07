package grpc_server

import (
	"context"
	"errors"

	"connectrpc.com/connect"
	"github.com/msvdaamen/food-swipe/internal/pkg/auth"
	"go.uber.org/zap"
)

func InterceptorLogger(l *zap.Logger) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			response, err := next(ctx, req)
			if err != nil && !errors.Is(err, &connect.Error{}) && !errors.Is(err, auth.ErrUnauthorized) {
				l.Error("error", zap.Error(err))
			}
			return response, err
		}
	}
}
