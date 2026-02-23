package http

import (
	"net/http"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type OAuthCallbackRequest struct {
	Code     string              `json:"code" validate:"required"`
	State    string              `json:"state" validate:"required"`
	Provider models.AuthProvider `json:"provider" validate:"required,oneof=google apple"`
}

// OAuthCallback handles the OAuth callback
func (a *Adapter) ExchangeCode(c *echo.Context) error {
	var req OAuthCallbackRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return err
	}

	authResp, err := a.core.ExchangeCode(c.Request().Context(), req.Code, req.State, req.Provider)
	if err != nil {
		return handleError(c, err)
	}

	return c.JSON(http.StatusOK, mapAuthResponse(authResp))
}
