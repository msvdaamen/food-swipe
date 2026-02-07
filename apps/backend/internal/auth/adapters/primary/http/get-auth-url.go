package http

import (
	"net/http"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type OAuthInitiateRequest struct {
	Provider    models.AuthProvider `json:"provider" validate:"required,oneof=google apple"`
	RedirectURI string              `json:"redirectUri" validate:"required,url"`
}

type OAuthInitiateResponse struct {
	AuthorizationURL string `json:"authorizationUrl"`
}

// InitiateOAuth starts the OAuth flow
func (a *Adapter) GetAuthUrl(c *echo.Context) error {
	var req OAuthInitiateRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return err
	}

	authURL, err := a.core.GetAuthUrl(c.Request().Context(), req.Provider, req.RedirectURI)
	if err != nil {
		return a.handleError(c, err)
	}

	return c.JSON(http.StatusOK, OAuthInitiateResponse{
		AuthorizationURL: authURL,
	})
}
