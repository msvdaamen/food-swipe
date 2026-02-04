package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type OAuthInitiateRequest struct {
	Provider    string `json:"provider" validate:"required,oneof=google apple"`
	RedirectURI string `json:"redirect_uri" validate:"required,url"`
}

type OAuthInitiateResponse struct {
	AuthorizationURL string `json:"authorization_url"`
	State            string `json:"state"`
}

// InitiateOAuth starts the OAuth flow
func (a *Adapter) InitiateOAuth(c *echo.Context) error {
	var req OAuthInitiateRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return (*c).JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
	}

	oauthReq, authURL, err := a.core.InitiateOAuthFlow((*c).Request().Context(), req.Provider, req.RedirectURI)
	if err != nil {
		return a.handleError(c, err)
	}

	return (*c).JSON(http.StatusOK, OAuthInitiateResponse{
		AuthorizationURL: authURL,
		State:            oauthReq.State,
	})
}
