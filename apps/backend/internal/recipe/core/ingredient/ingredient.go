package ingredient

import (
	"github.com/food-swipe/internal/recipe/core/port"
)

type Ingredient struct {
	storage port.Storage
}

func New(storage port.Storage) *Ingredient {
	return &Ingredient{storage: storage}
}
