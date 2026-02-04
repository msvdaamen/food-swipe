package http

import (
	"github.com/food-swipe/internal/user/core/port"
	"github.com/labstack/echo/v5"
)

type Adapter struct {
	core port.Handler
}

func New(httpServer *echo.Echo, core port.Handler) *Adapter {
	a := &Adapter{core: core}
	api := httpServer.Group("/v1/users")
	api.GET("", a.GetUsers)
	return a
}
