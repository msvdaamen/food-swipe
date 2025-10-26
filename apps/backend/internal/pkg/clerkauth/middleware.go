package clerkauth

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (a *Auth) Middleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user, err := a.AuthenticateRequest(c)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized)
		}
		c.Set("user", user)
		// Implement middleware logic here
		return next(c)
	}
}
