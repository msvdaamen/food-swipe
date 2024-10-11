package auth

import (
	"food-swipe.app/auth/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func Init(http fiber.Router, authMiddleware fiber.Handler, validator *validator.Validate, authService *service.Service) {
	authGroup := http.Group("/auth")
	RegisterController(authGroup, authMiddleware, validator, authService)
}
