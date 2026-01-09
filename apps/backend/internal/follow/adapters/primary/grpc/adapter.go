package grpc

import (
	"github.com/food-swipe/gen/grpc/food-swipe/v1/foodswipev1connect"
	"github.com/food-swipe/internal/follow/core/ports"
)

type Adapter struct {
	foodswipev1connect.UnimplementedFollowerServiceHandler

	core ports.Handler
}

func New(core ports.Handler) *Adapter {
	return &Adapter{
		core: core,
	}
}
