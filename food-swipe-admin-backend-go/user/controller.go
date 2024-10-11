package user

import (
	"fmt"
	"food-swipe.app/user/service"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

func RegisterController(router fiber.Router, userService *service.Service) {
	router.Get("/", func(context *fiber.Ctx) error {
		users, err := userService.GetAllUsers()
		if err != nil {
			fmt.Print(err)
			context.Status(fiber.StatusNotFound)
			return nil
		}
		return context.JSON(users)
	})
	router.Get("/:userId", func(context *fiber.Ctx) error {
		userIdStr := context.Params("userId")
		userId, err := strconv.ParseInt(userIdStr, 10, 32)
		if err != nil {
			return fmt.Errorf("invalid user id is not a number %s", userIdStr)
		}
		user, err := userService.GetUserById(int32(userId))
		if err != nil {
			context.Status(fiber.StatusNotFound)
			return nil
		}
		return context.JSON(user)
	})
}
