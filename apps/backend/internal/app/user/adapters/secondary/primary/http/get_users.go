package http

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (a *Adapter) GetUsers(ctx echo.Context) error {
	users, err := a.core.GetUsers(ctx.Request().Context())
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, users)
}
