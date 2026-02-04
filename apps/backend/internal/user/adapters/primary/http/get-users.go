package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type GetUsersParams struct {
	Limit uint32 `query:"limit" validate:"required,min=1,max=100"`
	Page  uint32 `query:"page" validate:"required,min=1"`
}

func (a *Adapter) GetUsers(ctx *echo.Context) error {
	params := new(GetUsersParams)
	if err := pkg.ValidateRequest(ctx, params); err != nil {
		return err
	}

	paginated, err := a.core.GetUsers(ctx.Request().Context(), params.Limit, params.Page)
	if err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, paginated)
}
