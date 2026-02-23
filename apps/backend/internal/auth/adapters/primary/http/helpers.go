package http

import (
	"net/http"

	"github.com/food-swipe/internal/auth/core"
	"github.com/food-swipe/internal/auth/core/models"
	userModels "github.com/food-swipe/internal/user/core/models"
	"github.com/labstack/echo/v5"
)

type AuthResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type UserResponse struct {
	ID              string  `json:"id"`
	Email           string  `json:"email"`
	EmailVerified   bool    `json:"emailVerified"`
	Username        string  `json:"username"`
	DisplayUsername string  `json:"displayUsername"`
	Name            string  `json:"name"`
	Image           *string `json:"image"`
	Role            string  `json:"role"`
	CreatedAt       string  `json:"createdAt"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

// handleError converts core errors to HTTP error responses
func handleError(c *echo.Context, err error) error {
	switch {
	case err == core.ErrInvalidCredentials:
		return c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "invalid_credentials",
			Message: "Invalid email or password",
		})
	case err == core.ErrUserAlreadyExists:
		return c.JSON(http.StatusConflict, ErrorResponse{
			Error:   "user_already_exists",
			Message: "A user with this email already exists",
		})
	case err == core.ErrUsernameAlreadyExists:
		return c.JSON(http.StatusConflict, ErrorResponse{
			Error:   "username_already_exists",
			Message: "This username is already taken",
		})
	case err == core.ErrUserNotFound:
		return c.JSON(http.StatusNotFound, ErrorResponse{
			Error:   "user_not_found",
			Message: "User not found",
		})
	case err == core.ErrInvalidToken:
		return c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "invalid_token",
			Message: "Invalid or expired token",
		})
	case err == core.ErrTokenExpired:
		return c.JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "token_expired",
			Message: "Token has expired",
		})
	case err == core.ErrTokenAlreadyUsed:
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "token_already_used",
			Message: "This token has already been used",
		})
	case err == core.ErrUserBanned:
		return c.JSON(http.StatusForbidden, ErrorResponse{
			Error:   "user_banned",
			Message: err.Error(),
		})
	case err == core.ErrInvalidOAuthState:
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_oauth_state",
			Message: "Invalid OAuth state",
		})
	case err == core.ErrOAuthStateExpired:
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "oauth_state_expired",
			Message: "OAuth state has expired",
		})
	case err == core.ErrProviderNotSupported:
		return c.JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "provider_not_supported",
			Message: "OAuth provider not supported",
		})
	case err == core.ErrInvalidProvider:
		return c.JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "invalid_provider_config",
			Message: "OAuth provider is not properly configured",
		})
	default:
		return err
	}
}

// mapAuthResponse converts core auth response to HTTP response
func mapAuthResponse(authResp *models.AuthResponse) *AuthResponse {
	return &AuthResponse{
		AccessToken:  authResp.AccessToken,
		RefreshToken: authResp.RefreshToken,
	}
}

// mapUserResponse converts core user model to HTTP response
func mapUserResponse(user *userModels.User) *UserResponse {
	return &UserResponse{
		ID:              user.ID.String(),
		Email:           user.Email,
		EmailVerified:   user.EmailVerified,
		Username:        user.Username,
		DisplayUsername: user.DisplayUsername,
		Name:            user.Name,
		Image:           user.Image,
		Role:            user.Role,
		CreatedAt:       user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

// mapTokenResponse converts core token pair to HTTP response
func mapTokenResponse(tokenPair *models.TokenPair) *AuthResponse {
	return &AuthResponse{
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
	}
}
