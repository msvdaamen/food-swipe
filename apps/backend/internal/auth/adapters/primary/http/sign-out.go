package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type SignOutRequest struct {
	RefreshToken string `json:"refreshToken" validate:"required"`
}

// SignOut revokes the current refresh token
func (a *Adapter) SignOut(c *echo.Context) error {
	// Get refresh token from request body or header
	var req SignOutRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return err
	}

	if err := a.core.RevokeToken(c.Request().Context(), req.RefreshToken); err != nil {
		return handleError(c, err)
	}

	return c.NoContent(http.StatusOK)
}
