package pkg

import (
	"github.com/labstack/echo/v5"
)

func String(str string) *string {
	return &str
}

func Bool(bl bool) *bool {
	return &bl
}

func ValidateRequest(c *echo.Context, i any) error {
	if err := c.Bind(i); err != nil {
		return err
	}

	if err := c.Validate(i); err != nil {
		return err
	}

	return nil
}
