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

// Login authenticates a user
func (a *Adapter) Login(c *echo.Context) error {
	var req LoginRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "validation_error",
			Message: err.Error(),
		})
	}

	authResp, err := a.core.Login(c.Request().Context(), req.Email, req.Password)
	if err != nil {
		return a.handleError(c, err)
	}

	return c.JSON(http.StatusOK, a.mapAuthResponse(authResp))
}
