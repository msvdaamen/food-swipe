package recipe

import (
	"github.com/food-swipe/internal/recipe/core/port"
)

type Recipe struct {
	storage port.Storage
}

func New(storage port.Storage) *Recipe {
	return &Recipe{storage: storage}
}
