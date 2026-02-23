package http

import (
	"github.com/food-swipe/internal/pkg/authenticator"
	"github.com/food-swipe/internal/user/core/port"
	"github.com/labstack/echo/v5"
)

type Adapter struct {
	core port.Handler
}

func New(httpServer *echo.Echo, core port.Handler, auth *authenticator.Provider) *Adapter {
	a := &Adapter{core: core}

	authMiddleware := authenticator.Middleware(auth)

	api := httpServer.Group("/v1/users", authMiddleware)
	api.GET("", a.GetUsers)
	return a
}
