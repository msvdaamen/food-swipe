package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type VerifyEmailRequest struct {
	Token string `json:"token" validate:"required"`
}

// VerifyEmail verifies a user's email
func (a *Adapter) VerifyEmail(c *echo.Context) error {
	var req VerifyEmailRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return err
	}

	if err := a.core.VerifyEmail(c.Request().Context(), req.Token); err != nil {
		return handleError(c, err)
	}

	return c.NoContent(http.StatusOK)
}
