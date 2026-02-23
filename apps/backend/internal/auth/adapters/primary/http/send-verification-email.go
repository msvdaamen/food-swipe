package http

import (
	"net/http"

	"github.com/food-swipe/internal/user/core/models"
	"github.com/labstack/echo/v5"
)

// SendVerificationEmail sends a verification email to the user
func (a *Adapter) SendVerificationEmail(c *echo.Context) error {
	user := c.Get("user").(*models.User)

	if err := a.core.SendVerificationEmail(c.Request().Context(), user.ID); err != nil {
		return handleError(c, err)
	}

	return c.NoContent(http.StatusOK)
}
