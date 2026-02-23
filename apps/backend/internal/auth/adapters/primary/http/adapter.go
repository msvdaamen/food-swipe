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
	http.POST("/sign-up", adapter.SignUp)
	http.POST("/sign-in", adapter.SignIn)
	http.POST("/refresh-token", adapter.RefreshToken)
	http.POST("/sign-in-social", adapter.GetAuthUrl)
	http.POST("/sign-in-social-callback", adapter.ExchangeCode)
	http.POST("/verify-email", adapter.VerifyEmail)
	http.POST("/password-reset/request", adapter.RequestPasswordReset)
	http.POST("/password-reset/confirm", adapter.ResetPassword)

	// Protected routes (require authentication)
	http.GET("/me", adapter.GetMe, authMiddleware)
	http.POST("/sign-out", adapter.SignOut, authMiddleware)
	http.POST("/sign-out-all", adapter.SignOutAll, authMiddleware)
	http.POST("/send-verification", adapter.SendVerificationEmail, authMiddleware)
	http.POST("/change-password", adapter.ChangePassword, authMiddleware)

	return adapter
}
