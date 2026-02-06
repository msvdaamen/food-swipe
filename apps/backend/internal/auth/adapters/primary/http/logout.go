package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

// Logout revokes the current refresh token
func (a *Adapter) Logout(c *echo.Context) error {
	// Get refresh token from request body or header
	var req RefreshTokenRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
	}

	if err := a.core.RevokeToken(c.Request().Context(), req.RefreshToken); err != nil {
		return a.handleError(c, err)
	}

	return c.JSON(http.StatusOK, MessageResponse{
		Message: "Successfully logged out",
	})
}
