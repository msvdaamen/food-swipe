package http

import (
	"net/http"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/labstack/echo/v5"
)

// LogoutAll revokes all refresh tokens for the user
func (a *Adapter) LogoutAll(c *echo.Context) error {
	user := c.Get("user").(*models.User)

	if err := a.core.RevokeAlltokens(c.Request().Context(), user.ID.String()); err != nil {
		return a.handleError(c, err)
	}

	return c.JSON(http.StatusOK, MessageResponse{
		Message: "Successfully logged out from all devices",
	})
}
