package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/labstack/echo/v5"
)

type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	Username string `json:"username" validate:"required,min=3,max=50"`
	Name     string `json:"name" validate:"required"`
}

// Register creates a new user account
func (a *Adapter) Register(c *echo.Context) error {
	var req RegisterRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return (*c).JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
	}

	authResp, err := a.core.Register((*c).Request().Context(), req.Email, req.Password, req.Username, req.Name)
	if err != nil {
		return a.handleError(c, err)
	}

	return (*c).JSON(http.StatusCreated, a.mapAuthResponse(authResp))
}
