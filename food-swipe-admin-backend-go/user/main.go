package user

import (
	"food-swipe.app/user/service"
	"github.com/gofiber/fiber/v2"
)

type App struct {
	Http     *fiber.App
	Services *Services
}

type Services struct {
	UserService *service.Service
}

func Init(app *fiber.App, userService *service.Service) {

	services := &Services{
		userService,
	}

	app.Route("/users", func(router fiber.Router) {
		RegisterController(router, services)
	})
}
