package http

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var validate = validator.New(validator.WithRequiredStructEnabled())

func ParseBody(c *fiber.Ctx, payload interface{}) error {
	if err := c.BodyParser(payload); err != nil {
		return err
	}
	return validate.Struct(payload)
}

func ParseQuery(c *fiber.Ctx, payload interface{}) error {
	if err := c.QueryParser(payload); err != nil {
		return err
	}
	return validate.Struct(payload)
}
