package grpc

import (
	"context"

	"connectrpc.com/connect"
	"go.uber.org/zap"
)

func NewLoggerInterceptor(logger *zap.Logger) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			response, err := next(ctx, req)
			if err != nil {
				logger.Error("GRPC request failed", zap.Error(err))
			}
			return response, err
		}
	}
}
