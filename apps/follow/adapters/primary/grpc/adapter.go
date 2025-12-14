package grpc

import (
	"github.com/food-swipe/follow/core/ports"
	"github.com/food-swipe/gen/followers/v1/followersv1connect"
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
