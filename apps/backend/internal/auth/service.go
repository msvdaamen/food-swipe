package auth

import (
	"github.com/food-swipe/internal/auth/adapters/primary/http"
	"github.com/food-swipe/internal/auth/adapters/secondary/storage"
	"github.com/food-swipe/internal/auth/core"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/labstack/echo/v5"
)

func Register(httpServer *echo.Echo, pool *pgxpool.Pool) {

	storageAdapter := storage.New(pool)

	core := core.New(storageAdapter)

	http.New(httpServer, core)
}
