package http

type UpdateDisplayUsernameRequest struct {
	DisplayUsername *string `json:"display_username"`
}

// UpdateDisplayUsername updates the user's display username
// func (a *Adapter) UpdateDisplayUsername(c *echo.Context) error {
// 	user := c.Get("user").(*models.User)

// 	var req UpdateDisplayUsernameRequest
// 	if err := pkg.ValidateRequest(c, &req); err != nil {
// 		return c.JSON(http.StatusBadRequest, ErrorResponse{
// 			Error:   "validation_error",
// 			Message: err.Error(),
// 		})
// 	}

// 	if err := a.core.UpdateDisplayUsername(c.Request().Context(), user.ID.String(), req.DisplayUsername); err != nil {
// 		return a.handleError(c, err)
// 	}

// 	return c.JSON(http.StatusOK, MessageResponse{
// 		Message: "Display username updated successfully",
// 	})
// }
