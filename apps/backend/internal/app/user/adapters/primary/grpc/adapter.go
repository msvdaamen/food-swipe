package grpc

import (
	"github.com/msvdaamen/food-swipe/gen/api/v1/apiv1connect"
	"github.com/msvdaamen/food-swipe/internal/app/user/core/port"
)

type Adapter struct {
	apiv1connect.UnimplementedUserServiceHandler

	core port.Handler
}

func New(core port.Handler) *Adapter {
	return &Adapter{
		core: core,
	}
}
