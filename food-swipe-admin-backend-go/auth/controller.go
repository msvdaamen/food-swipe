package auth

import (
	"food-swipe.app/auth/dto"
	authService "food-swipe.app/auth/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func RegisterController(router fiber.Router, authMiddleware fiber.Handler, validator *validator.Validate, service *authService.Service) {
	router.Post("/sign-in", func(c *fiber.Ctx) error {
		payload := &dto.SignInDto{}
		if err := c.BodyParser(payload); err != nil {
			return err
		}
		err := validator.Struct(payload)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
		signInResponse, err := service.SignIn(*payload)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		return c.JSON(signInResponse)
	})
	router.Post("/refresh-token", func(c *fiber.Ctx) error {
		payload := &dto.RefreshTokenDto{}
		if err := c.BodyParser(payload); err != nil {
			return err
		}
		err := validator.Struct(payload)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
		refreshTokenResponse, err := service.RefreshToken(payload.RefreshToken)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		return c.JSON(refreshTokenResponse)
	})

	router.Get("/me", authMiddleware, func(c *fiber.Ctx) error {
		user := c.Locals("user").(authService.AuthUser)
		return c.JSON(user)
	})
	router.Post("/sign-out", authMiddleware, func(c *fiber.Ctx) error {
		user := c.Locals("user").(authService.AuthUser)
		err := service.SignOut(user.Id)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		return c.JSON(fiber.Map{"message": "signed out"})
	})
}
