package http

import (
	"food-swipe.app/auth/dto"
	"food-swipe.app/common/http"
	"github.com/gofiber/fiber/v2"
)

func (s *controller) refreshToken(c *fiber.Ctx) error {
	payload := &dto.RefreshTokenDto{}
	err := http.ParseBody(c, payload)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	refreshTokenResponse, err := s.service.RefreshToken(payload.RefreshToken)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	return c.JSON(refreshTokenResponse)
}
