package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// SignIn authenticates a user
func (a *Adapter) SignIn(c *echo.Context) error {
	var req LoginRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return err
	}

	authResp, err := a.core.SignIn(c.Request().Context(), req.Email, req.Password)
	if err != nil {
		return handleError(c, err)
	}

	return c.JSON(http.StatusOK, mapAuthResponse(authResp))
}
