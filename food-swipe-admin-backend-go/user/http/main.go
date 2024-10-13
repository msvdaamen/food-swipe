package http

import (
	"food-swipe.app/user/service"
	"github.com/gofiber/fiber/v2"
)

type controller struct {
	userService *service.Service
}

func (s *controller) handle(router fiber.Router) {
	router.Get("/", s.getAllUsers)
	router.Get("/:userId", s.getUser)
}

func RegisterService(router fiber.Router, userService *service.Service) {
	controller := controller{userService}
	controller.handle(router)
}
