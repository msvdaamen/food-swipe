package http

import (
	"food-swipe.app/ingredient/service"
	"github.com/gofiber/fiber/v2"
)

type controller struct {
	service        *service.Service
	authMiddleware fiber.Handler
}

func (s *controller) handle(router fiber.Router) {
	router.Get("/", s.authMiddleware, s.GetAll)
	router.Post("/", s.authMiddleware, s.CreateIngredient)
	//router.Get("/ingredients/:id", s.authMiddleware, s.getIngredient)
	//router.Put("/ingredients/:id", s.authMiddleware, s.updateIngredient)
	//router.Delete("/ingredients/:id", s.authMiddleware, s.deleteIngredient)
}

func New(router fiber.Router, authMiddleware fiber.Handler, service *service.Service) {
	controller := &controller{
		service:        service,
		authMiddleware: authMiddleware,
	}
	controller.handle(router)
}
