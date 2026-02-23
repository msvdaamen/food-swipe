package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type SignUpRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	Username string `json:"username" validate:"required,min=3,max=50"`
	Name     string `json:"name" validate:"required"`
}

// Register creates a new user account
func (a *Adapter) SignUp(c *echo.Context) error {
	var req SignUpRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return err
	}

	authResp, err := a.core.SignUp(c.Request().Context(), req.Email, req.Password, req.Username, req.Name)
	if err != nil {
		return handleError(c, err)
	}

	return c.JSON(http.StatusCreated, mapAuthResponse(authResp))
}
