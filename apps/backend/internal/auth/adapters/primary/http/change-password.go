package http

import (
	"net/http"

	"github.com/food-swipe/internal/pkg"
	"github.com/food-swipe/internal/user/core/models"
	"github.com/labstack/echo/v5"
)

type ChangePasswordRequest struct {
	OldPassword string `json:"oldPassword" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required,min=8"`
}

// ChangePassword changes a user's password
func (a *Adapter) ChangePassword(c *echo.Context) error {
	user := c.Get("user").(*models.User)

	var req ChangePasswordRequest
	if err := pkg.ValidateRequest(c, &req); err != nil {
		return err
	}

	if err := a.core.ChangePassword(c.Request().Context(), user.ID, req.OldPassword, req.NewPassword); err != nil {
		return handleError(c, err)
	}

	return c.NoContent(http.StatusOK)
}
