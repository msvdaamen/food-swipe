package http

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
)

func (s *controller) getAllUsers(context *fiber.Ctx) error {
	users, err := s.userService.GetAllUsers()
	if err != nil {
		fmt.Print(err)
		context.Status(fiber.StatusNotFound)
		return nil
	}
	return context.JSON(users)
}
