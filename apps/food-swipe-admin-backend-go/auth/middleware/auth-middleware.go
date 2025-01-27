package middleware

import (
	"food-swipe.app/auth/service"
	"food-swipe.app/common/jwt"
	UserService "food-swipe.app/user/service"
	"github.com/gofiber/fiber/v2"
	"strconv"
	"strings"
)

func New(jwtService *jwt.Jwt, userService *UserService.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		bearer := c.Get("Authorization")
		if bearer == "" {
			return unauthorized(c)
		}
		token := strings.Split(bearer, " ")[1]
		if token == "" {
			return unauthorized(c)
		}
		tokenObj, err := jwtService.Verify(token)
		if err != nil {
			return unauthorized(c)
		}
		userIdStr, err := tokenObj.Claims.GetSubject()
		if err != nil {
			return unauthorized(c)
		}
		userId, err := strconv.ParseInt(userIdStr, 10, 32)
		user, err := userService.GetUserById(int32(userId))
		if err != nil {
			return unauthorized(c)
		}
		c.Locals("user", service.UserToAuthUser(*user))
		return c.Next()
	}
}

func unauthorized(c *fiber.Ctx) error {
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": "Unauthorized",
	})
}
