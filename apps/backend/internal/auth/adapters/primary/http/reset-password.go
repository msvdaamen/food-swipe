package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type ResetPasswordRequest struct {
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"new_password" validate:"required,min=8"`
}

// ResetPassword resets a user's password
func (a *Adapter) ResetPassword(c *echo.Context) error {
	var req ResetPasswordRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
	}

	if err := a.core.ResetPassword(c.Request().Context(), req.Token, req.NewPassword); err != nil {
		return a.handleError(c, err)
	}

	return c.JSON(http.StatusOK, MessageResponse{
		Message: "Password reset successfully",
	})
}
