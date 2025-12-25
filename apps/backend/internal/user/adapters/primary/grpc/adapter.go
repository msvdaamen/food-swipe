package grpc

import (
	"github.com/food-swipe/gen/grpc/food-swipe/v1/foodswipev1connect"
	"github.com/food-swipe/internal/user/core/port"
)

type Adapter struct {
	foodswipev1connect.UnimplementedUserServiceHandler

	core port.Handler
}

func New(core port.Handler) *Adapter {
	return &Adapter{
		core: core,
	}
}
