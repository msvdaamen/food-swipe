package http

import (
	authService "food-swipe.app/auth/service"
	"github.com/gofiber/fiber/v2"
)

func (s *controller) me(c *fiber.Ctx) error {
	user := c.Locals("user").(authService.AuthUser)
	return c.JSON(user)
}
