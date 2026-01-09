package core

import (
	"github.com/food-swipe/internal/recipe/core/ingredient"
	"github.com/food-swipe/internal/recipe/core/measurement"
	"github.com/food-swipe/internal/recipe/core/port"
	"github.com/food-swipe/internal/recipe/core/recipe"
)

type Core struct {
	*ingredient.Ingredient
	*measurement.Measurement
	*recipe.Recipe

	storage port.Storage
}

func New(storage port.Storage, fileStorage port.FileStorage) *Core {
	return &Core{
		Ingredient:  ingredient.New(storage),
		Measurement: measurement.New(storage),
		Recipe:      recipe.New(storage, fileStorage),
		storage:     storage,
	}
}
