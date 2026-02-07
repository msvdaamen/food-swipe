package http

import (
	"github.com/food-swipe/internal/auth/core/port"
	"github.com/food-swipe/internal/pkg/authenticator"
	"github.com/labstack/echo/v5"
)

type Adapter struct {
	core port.Handler
}

func New(httpServer *echo.Echo, core port.Handler, auth *authenticator.Provider) *Adapter {
	adapter := &Adapter{
		core: core,
	}

	authMiddleware := authenticator.Middleware(auth)

	// Auth routes
	http := httpServer.Group("/v1/auth")

	// Public routes
	http.POST("/register", adapter.Register)
	http.POST("/login", adapter.Login)
	http.POST("/refresh", adapter.RefreshToken)
	http.POST("/oauth/get-auth-url", adapter.GetAuthUrl)
	http.POST("/oauth/callback", adapter.ExchangeCode)
	http.POST("/verify-email", adapter.VerifyEmail)
	http.POST("/password-reset/request", adapter.RequestPasswordReset)
	http.POST("/password-reset/confirm", adapter.ResetPassword)

	// Protected routes (require authentication)
	http.GET("/me", adapter.GetMe, authMiddleware)
	http.POST("/logout", adapter.Logout, authMiddleware)
	http.POST("/logout-all", adapter.LogoutAll, authMiddleware)
	// auth.PUT("/username", adapter.UpdateUsername, AuthMiddleware(core))
	// auth.PUT("/display-username", adapter.UpdateDisplayUsername, AuthMiddleware(core))
	http.POST("/send-verification", adapter.SendVerificationEmail, authMiddleware)
	http.POST("/change-password", adapter.ChangePassword, authMiddleware)

	return adapter
}
