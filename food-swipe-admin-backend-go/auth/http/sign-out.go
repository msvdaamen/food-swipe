package http

import (
	authService "food-swipe.app/auth/service"
	"github.com/gofiber/fiber/v2"
)

func (s *controller) singOut(c *fiber.Ctx) error {
	user := c.Locals("user").(authService.AuthUser)
	err := s.service.SignOut(user.Id)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(fiber.Map{"message": "signed out"})
}
