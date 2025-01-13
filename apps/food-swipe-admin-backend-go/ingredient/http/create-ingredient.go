package http

import (
	"food-swipe.app/common/http"
	"food-swipe.app/ingredient/dto"
	"github.com/gofiber/fiber/v2"
)

func (s *controller) CreateIngredient(ctx *fiber.Ctx) error {
	payload := &dto.CreateIngredientDto{}
	if err := http.ParseBody(ctx, payload); err != nil {
		return err
	}

	ingredient, err := s.service.CreateIngredient(payload)
	if err != nil {
		return err
	}

	return ctx.JSON(ingredient)

}
