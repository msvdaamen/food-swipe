package recipe

import (
	"github.com/food-swipe/internal/recipe/core/port"
)

type Recipe struct {
	storage     port.Storage
	fileStorage port.FileStorage
}

func New(storage port.Storage, fileStorage port.FileStorage) *Recipe {
	return &Recipe{storage: storage, fileStorage: fileStorage}
}
