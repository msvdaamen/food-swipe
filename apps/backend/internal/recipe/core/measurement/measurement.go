package measurement

import (
	"github.com/food-swipe/internal/recipe/core/port"
)

type Measurement struct {
	storage port.Storage
}

func New(storage port.Storage) *Measurement {
	return &Measurement{storage: storage}
}
