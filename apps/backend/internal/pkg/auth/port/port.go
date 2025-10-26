package auth

import (
	"context"

	"github.com/labstack/echo/v4"
	"github.com/msvdaamen/food-swipe/internal/pkg/auth"
)

type Port interface {
	IsAuthenticated(ctx context.Context, sessionToken string) (bool, error)
	AuthenticateRequest(ctx echo.Context) (*auth.User, error)
	Middleware(next echo.HandlerFunc) echo.HandlerFunc
}
