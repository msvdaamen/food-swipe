package http

import (
	"github.com/food-swipe/internal/auth/core"
	"github.com/labstack/echo/v5"
)

type Adapter struct {
	core *core.Core
}

func New(httpServer *echo.Echo, core *core.Core) *Adapter {
	adapter := &Adapter{
		core: core,
	}

	// Auth routes
	auth := httpServer.Group("/api/auth")

	// Public routes
	auth.POST("/register", adapter.Register)
	auth.POST("/login", adapter.Login)
	auth.POST("/refresh", adapter.RefreshToken)
	auth.POST("/oauth/initiate", adapter.InitiateOAuth)
	auth.POST("/oauth/callback", adapter.OAuthCallback)
	auth.POST("/verify-email", adapter.VerifyEmail)
	auth.POST("/password-reset/request", adapter.RequestPasswordReset)
	auth.POST("/password-reset/confirm", adapter.ResetPassword)

	// Protected routes (require authentication)
	auth.GET("/me", adapter.GetMe, AuthMiddleware(core))
	auth.POST("/logout", adapter.Logout, AuthMiddleware(core))
	auth.POST("/logout-all", adapter.LogoutAll, AuthMiddleware(core))
	auth.PUT("/username", adapter.UpdateUsername, AuthMiddleware(core))
	auth.PUT("/display-username", adapter.UpdateDisplayUsername, AuthMiddleware(core))
	auth.POST("/send-verification", adapter.SendVerificationEmail, AuthMiddleware(core))
	auth.POST("/change-password", adapter.ChangePassword, AuthMiddleware(core))

	return adapter
}
