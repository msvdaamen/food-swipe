package grpc

import (
	"github.com/food-swipe/gen/grpc/followers/v1/followersv1connect"
	"github.com/food-swipe/internal/follow/core/ports"
)

type Adapter struct {
	followersv1connect.UnimplementedFollowerServiceHandler

	core ports.Handler
}

func New(core ports.Handler) *Adapter {
	return &Adapter{
		core: core,
	}
}
