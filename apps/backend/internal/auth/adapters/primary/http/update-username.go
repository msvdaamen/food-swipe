package http

type UpdateUsernameRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
}

// UpdateUsername updates the user's username
// func (a *Adapter) UpdateUsername(c *echo.Context) error {
// 	user := c.Get("user").(*models.User)

// 	var req UpdateUsernameRequest
// 	if err := pkg.ValidateRequest(c, &req); err != nil {
// 		return c.JSON(http.StatusBadRequest, ErrorResponse{
// 			Error:   "validation_error",
// 			Message: err.Error(),
// 		})
// 	}

// 	if err := a.core.UpdateUsername(c.Request().Context(), user.ID.String(), req.Username); err != nil {
// 		return a.handleError(c, err)
// 	}

// 	return c.JSON(http.StatusOK, MessageResponse{
// 		Message: "Username updated successfully",
// 	})
// }
