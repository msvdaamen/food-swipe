package http

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

func (s *controller) getUser(context *fiber.Ctx) error {
	userIdStr := context.Params("userId")
	userId, err := strconv.ParseInt(userIdStr, 10, 32)
	if err != nil {
		return fmt.Errorf("invalid user id is not a number %s", userIdStr)
	}
	user, err := s.userService.GetUserById(int32(userId))
	if err != nil {
		context.Status(fiber.StatusNotFound)
		return nil
	}
	return context.JSON(user)
}
