package http

import (
	"github.com/labstack/echo/v4"
	"github.com/msvdaamen/food-swipe/internal/app/user/core/port"
	"github.com/msvdaamen/food-swipe/internal/pkg/auth"
)

type Adapter struct {
	core port.Handler
}

func New(httpServer *echo.Echo, core port.Handler, auth auth.Auth) *Adapter {
	adapter := &Adapter{
		core: core,
	}
	adapter.registerRoutes(httpServer, auth)
	return adapter
}

func (a *Adapter) registerRoutes(httpServer *echo.Echo, auth auth.Auth) {
	httpServer.Use(auth.Middleware)
	httpServer.GET("/v1/users", a.GetUsers)
}
