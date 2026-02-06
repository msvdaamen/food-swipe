package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type RequestPasswordResetRequest struct {
	Email string `json:"email" validate:"required,email"`
}

// RequestPasswordReset sends a password reset email
func (a *Adapter) RequestPasswordReset(c *echo.Context) error {
	var req RequestPasswordResetRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
	}

	if err := a.core.RequestPasswordReset(c.Request().Context(), req.Email); err != nil {
		return a.handleError(c, err)
	}

	return c.JSON(http.StatusOK, MessageResponse{
		Message: "If the email exists, a password reset link has been sent",
	})
}
