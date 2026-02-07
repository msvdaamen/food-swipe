package authenticator

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v5"
)

type UnAuthenticatedError struct {
	Message string
}

// AuthMiddleware is an Echo middleware that validates JWT access tokens
func Middleware(authenticator *Provider) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			// Get the Authorization header
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.String(http.StatusUnauthorized, "")
			}

			// Check if it's a Bearer token
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || parts[0] != "Bearer" {
				return c.String(http.StatusUnauthorized, "")
			}

			token := parts[1]

			// Validate the token
			userID, err := authenticator.Authenticate(token)
			if err != nil {
				return c.String(http.StatusUnauthorized, "")
			}

			// Store user in context for use in handlers
			c.Set("userID", userID)

			return next(c)
		}
	}
}
