package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type ResetPasswordRequest struct {
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required,min=8"`
}

// ResetPassword resets a user's password
func (a *Adapter) ResetPassword(c *echo.Context) error {
	var req ResetPasswordRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return err
	}

	if err := a.core.ResetPassword(c.Request().Context(), req.Token, req.NewPassword); err != nil {
		return handleError(c, err)
	}

	return c.NoContent(http.StatusOK)
}
