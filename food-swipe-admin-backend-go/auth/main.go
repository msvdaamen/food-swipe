package auth

import (
	"food-swipe.app/auth/http"
	"food-swipe.app/auth/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func Init(router fiber.Router, authMiddleware fiber.Handler, validator *validator.Validate, authService *service.Service) {
	authGroup := router.Group("/auth")
	http.RegisterService(authGroup, authMiddleware, validator, authService)
}
