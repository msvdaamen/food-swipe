package http

import (
	"net/http"

	"github.com/food-swipe/internal/user/core/models"
	"github.com/labstack/echo/v5"
)

// GetMe returns the current authenticated user
func (a *Adapter) GetMe(c *echo.Context) error {
	user := c.Get("user").(*models.User)
	return c.JSON(http.StatusOK, mapUserResponse(user))
}
