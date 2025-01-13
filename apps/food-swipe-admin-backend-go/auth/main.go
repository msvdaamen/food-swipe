package auth

import (
	"food-swipe.app/auth/http"
	"food-swipe.app/auth/service"
	"github.com/gofiber/fiber/v2"
)

func Init(router fiber.Router, authMiddleware fiber.Handler, authService *service.Service) {
	authGroup := router.Group("/auth")
	http.RegisterService(authGroup, authMiddleware, authService)
}
