package auth

import (
	"errors"

	"github.com/labstack/echo/v4"
	"github.com/msvdaamen/food-swipe/internal/app/user/core/model"
)

var ErrUnauthorized = errors.New("unauthorized")

type Auth interface {
	Middleware(next echo.HandlerFunc) echo.HandlerFunc
	AuthenticateRequest(ctx echo.Context) (*model.User, error)
}
