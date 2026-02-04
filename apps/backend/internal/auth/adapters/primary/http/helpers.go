package http

import (
	"net/http"

	"github.com/food-swipe/internal/auth/core"
	"github.com/food-swipe/internal/auth/core/models"
	"github.com/labstack/echo/v5"
)

// handleError converts core errors to HTTP error responses
func (a *Adapter) handleError(c *echo.Context, err error) error {
	switch {
	case err == core.ErrInvalidCredentials:
		return (*c).JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "invalid_credentials",
			Message: "Invalid email or password",
		})
	case err == core.ErrUserAlreadyExists:
		return (*c).JSON(http.StatusConflict, ErrorResponse{
			Error:   "user_already_exists",
			Message: "A user with this email already exists",
		})
	case err == core.ErrUsernameAlreadyExists:
		return (*c).JSON(http.StatusConflict, ErrorResponse{
			Error:   "username_already_exists",
			Message: "This username is already taken",
		})
	case err == core.ErrUserNotFound:
		return (*c).JSON(http.StatusNotFound, ErrorResponse{
			Error:   "user_not_found",
			Message: "User not found",
		})
	case err == core.ErrInvalidToken:
		return (*c).JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "invalid_token",
			Message: "Invalid or expired token",
		})
	case err == core.ErrTokenExpired:
		return (*c).JSON(http.StatusUnauthorized, ErrorResponse{
			Error:   "token_expired",
			Message: "Token has expired",
		})
	case err == core.ErrTokenAlreadyUsed:
		return (*c).JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "token_already_used",
			Message: "This token has already been used",
		})
	case err == core.ErrUserBanned:
		return (*c).JSON(http.StatusForbidden, ErrorResponse{
			Error:   "user_banned",
			Message: err.Error(),
		})
	case err == core.ErrInvalidOAuthState:
		return (*c).JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "invalid_oauth_state",
			Message: "Invalid OAuth state",
		})
	case err == core.ErrOAuthStateExpired:
		return (*c).JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "oauth_state_expired",
			Message: "OAuth state has expired",
		})
	case err == core.ErrProviderNotSupported:
		return (*c).JSON(http.StatusBadRequest, ErrorResponse{
			Error:   "provider_not_supported",
			Message: "OAuth provider not supported",
		})
	case err == core.ErrInvalidProvider:
		return (*c).JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "invalid_provider_config",
			Message: "OAuth provider is not properly configured",
		})
	default:
		return (*c).JSON(http.StatusInternalServerError, ErrorResponse{
			Error:   "internal_error",
			Message: "An internal error occurred",
		})
	}
}

// mapAuthResponse converts core auth response to HTTP response
func (a *Adapter) mapAuthResponse(authResp *models.AuthResponse) *AuthResponse {
	return &AuthResponse{
		User:  a.mapUserResponse(authResp.User),
		Token: a.mapTokenResponse(authResp.TokenPair),
	}
}

// mapUserResponse converts core user model to HTTP response
func (a *Adapter) mapUserResponse(user *models.User) *UserResponse {
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
func (a *Adapter) mapTokenResponse(tokenPair *models.TokenPair) *TokenResponse {
	return &TokenResponse{
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
		ExpiresIn:    tokenPair.ExpiresIn,
		TokenType:    "Bearer",
	}
}
