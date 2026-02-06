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
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
	}

	if err := a.core.VerifyEmail(c.Request().Context(), req.Token); err != nil {
		return a.handleError(c, err)
	}

	return c.JSON(http.StatusOK, MessageResponse{
		Message: "Email verified successfully",
	})
}
