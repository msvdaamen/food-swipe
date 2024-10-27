package http

import (
	"food-swipe.app/common/http"
	"food-swipe.app/ingredient/dto"
	"github.com/gofiber/fiber/v2"
)

func (s *controller) GetAll(ctx *fiber.Ctx) error {
	payload := &dto.GetAll{}
	err := http.ParseQuery(ctx, payload)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	ingredients, err := s.service.GetAll(*payload)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}
	return ctx.JSON(ingredients)
}
