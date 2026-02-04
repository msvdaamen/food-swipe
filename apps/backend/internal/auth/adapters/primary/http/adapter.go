package http

import (
	"github.com/food-swipe/internal/auth/core"
	"github.com/labstack/echo/v5"
)

type Adapter struct {
	core *core.Core
}

func New(httpServer *echo.Echo, core *core.Core) *Adapter {
	adapter := &Adapter{
		core: core,
	}

	return adapter
}
