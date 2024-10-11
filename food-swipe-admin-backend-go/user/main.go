package user

import (
	"food-swipe.app/user/service"
	"github.com/gofiber/fiber/v2"
)

func Init(app fiber.Router, authMiddleware fiber.Handler, userService *service.Service) {

	userRoute := app.Group("/users", authMiddleware)
	RegisterController(userRoute, userService)
}
