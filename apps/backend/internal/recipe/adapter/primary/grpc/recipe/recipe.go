package recipe

import (
	"github.com/food-swipe/internal/recipe/core/port"
)

type Recipe struct {
	core port.Handler
}

func New(core port.Handler) *Recipe {
	return &Recipe{core: core}
}
