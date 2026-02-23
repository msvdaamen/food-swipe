package http

import (
	"net/http"

	"github.com/food-swipe/internal/user/core/models"
	"github.com/labstack/echo/v5"
)

// LogoutAll revokes all refresh tokens for the user
func (a *Adapter) SignOutAll(c *echo.Context) error {
	user := c.Get("user").(*models.User)

	if err := a.core.RevokeAlltokens(c.Request().Context(), user.ID); err != nil {
		return handleError(c, err)
	}

	return c.NoContent(http.StatusOK)
}
