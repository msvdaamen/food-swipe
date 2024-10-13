package http

import (
	authService "food-swipe.app/auth/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type controller struct {
	service        *authService.Service
	authMiddleware fiber.Handler
}

func (s *controller) handle(router fiber.Router) {
	router.Post("/sign-in", s.signIn)
	router.Post("/refresh-token", s.refreshToken)
	router.Get("/me", s.authMiddleware, s.me)
	router.Post("/sign-out", s.authMiddleware, s.singOut)
}

func RegisterService(router fiber.Router, authMiddleware fiber.Handler, validator *validator.Validate, service *authService.Service) {
	controller := &controller{
		service:        service,
		authMiddleware: authMiddleware,
	}
	controller.handle(router)
}
