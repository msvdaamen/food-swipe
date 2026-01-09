package ingredient

import (
	"github.com/food-swipe/internal/recipe/core/port"
)

type Ingredient struct {
	core port.Handler
}

func New(core port.Handler) *Ingredient {
	return &Ingredient{core: core}
}
