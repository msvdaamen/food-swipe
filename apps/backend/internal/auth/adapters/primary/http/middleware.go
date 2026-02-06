package http

import (
	"net/http"
	"strings"

	"github.com/food-swipe/internal/auth/core"
	"github.com/food-swipe/internal/auth/core/models"
	"github.com/labstack/echo/v5"
)

// AuthMiddleware is an Echo middleware that validates JWT access tokens
func AuthMiddleware(authCore *core.Core) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			// Get the Authorization header
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Error:   "missing_authorization",
					Message: "Authorization header is required",
				})
			}

			// Check if it's a Bearer token
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || parts[0] != "Bearer" {
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Error:   "invalid_authorization",
					Message: "Authorization header must be in the format: Bearer {token}",
				})
			}

			token := parts[1]

			// Validate the token
			user, err := authCore.ValidateAccessToken(c.Request().Context(), token)
			if err != nil {
				if err == core.ErrTokenExpired {
					return c.JSON(http.StatusUnauthorized, ErrorResponse{
						Error:   "token_expired",
						Message: "Access token has expired. Please refresh your token.",
					})
				}
				if err == core.ErrInvalidToken {
					return c.JSON(http.StatusUnauthorized, ErrorResponse{
						Error:   "invalid_token",
						Message: "Invalid access token",
					})
				}
				if err == core.ErrUserBanned {
					return c.JSON(http.StatusForbidden, ErrorResponse{
						Error:   "user_banned",
						Message: "Your account has been banned",
					})
				}
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Error:   "unauthorized",
					Message: "Authentication failed",
				})
			}

			// Store user in context for use in handlers
			c.Set("user", user)

			return next(c)
		}
	}
}

// OptionalAuthMiddleware is similar to AuthMiddleware but doesn't fail if no token is provided
func OptionalAuthMiddleware(authCore *core.Core) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			// Get the Authorization header
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				// No auth header, continue without setting user
				return next(c)
			}

			// Check if it's a Bearer token
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || parts[0] != "Bearer" {
				// Invalid format, continue without setting user
				return next(c)
			}

			token := parts[1]

			// Validate the token
			user, err := authCore.ValidateAccessToken(c.Request().Context(), token)
			if err == nil && user != nil {
				// Valid token, store user in context
				c.Set("user", user)
			}

			return next(c)
		}
	}
}

// RoleMiddleware checks if the authenticated user has one of the required roles
func RoleMiddleware(roles ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			userInterface := c.Get("user")
			if userInterface == nil {
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Error:   "unauthorized",
					Message: "Authentication required",
				})
			}

			// Type assert to get the user model
			user, ok := userInterface.(*models.User)
			if !ok {
				return c.JSON(http.StatusForbidden, ErrorResponse{
					Error:   "forbidden",
					Message: "Access denied",
				})
			}

			// Check if user has one of the required roles
			for _, role := range roles {
				if user.Role == role {
					return next(c)
				}
			}

			return c.JSON(http.StatusForbidden, ErrorResponse{
				Error:   "forbidden",
				Message: "Insufficient permissions",
			})
		}
	}
}
