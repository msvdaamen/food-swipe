package storage

import (
	"github.com/food-swipe/internal/recipe/adapter/secondary/storage/ingredient"
	"github.com/food-swipe/internal/recipe/adapter/secondary/storage/measurement"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Adapter struct {
	*ingredient.Ingredient
	*measurement.Measurement

	db *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Adapter {
	return &Adapter{
		db:          pool,
		Ingredient:  ingredient.New(pool),
		Measurement: measurement.New(pool),
	}
}
