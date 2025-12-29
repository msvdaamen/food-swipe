package core

import (
	"github.com/food-swipe/internal/recipe/core/ingredient"
	"github.com/food-swipe/internal/recipe/core/measurement"
	"github.com/food-swipe/internal/recipe/core/port"
)

type Core struct {
	*ingredient.Ingredient
	*measurement.Measurement

	storage port.Storage
}

func New(storage port.Storage) *Core {
	return &Core{
		Ingredient:  ingredient.New(storage),
		Measurement: measurement.New(storage),
		storage:     storage,
	}
}
