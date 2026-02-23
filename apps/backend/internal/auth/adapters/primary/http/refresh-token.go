package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" validate:"required"`
}

// RefreshToken generates a new access token
func (a *Adapter) RefreshToken(c *echo.Context) error {
	var req RefreshTokenRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return err
	}

	tokenPair, err := a.core.RefreshToken(c.Request().Context(), req.RefreshToken)
	if err != nil {
		return handleError(c, err)
	}

	return c.JSON(http.StatusOK, mapTokenResponse(tokenPair))
}
