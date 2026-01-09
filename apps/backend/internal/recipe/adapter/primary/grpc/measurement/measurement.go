package measurement

import (
	"github.com/food-swipe/internal/recipe/core/port"
)

type Measurement struct {
	core port.Handler
}

func New(core port.Handler) *Measurement {
	return &Measurement{core: core}
}
