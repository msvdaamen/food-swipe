package grpc

import (
	"github.com/food-swipe/internal/recipe/adapter/primary/grpc/ingredient"
	"github.com/food-swipe/internal/recipe/adapter/primary/grpc/measurement"
	"github.com/food-swipe/internal/recipe/core/port"
)

type Adapter struct {
	*ingredient.Ingredient
	*measurement.Measurement

	core port.Handler
}

func New(core port.Handler) *Adapter {
	return &Adapter{
		core:        core,
		Ingredient:  ingredient.New(core),
		Measurement: measurement.New(core),
	}
}
