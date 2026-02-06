package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type OAuthCallbackRequest struct {
	Code     string `json:"code" validate:"required"`
	State    string `json:"state" validate:"required"`
	Provider string `json:"provider" validate:"required,oneof=google apple"`
}

// OAuthCallback handles the OAuth callback
func (a *Adapter) OAuthCallback(c *echo.Context) error {
	var req OAuthCallbackRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
	}

	authResp, err := a.core.ExchangeCode(c.Request().Context(), req.Code, req.State, req.Provider)
	if err != nil {
		return a.handleError(c, err)
	}

	return c.JSON(http.StatusOK, a.mapAuthResponse(authResp))
}
