package http

import (
	"food-swipe.app/auth/dto"
	"food-swipe.app/common/http"
	"github.com/gofiber/fiber/v2"
)

func (s *controller) signIn(c *fiber.Ctx) error {
	payload := &dto.SignInDto{}
	err := http.ParseBody(c, payload)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	signInResponse, err := s.service.SignIn(*payload)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.JSON(signInResponse)
}
