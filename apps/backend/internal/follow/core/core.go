package core

import "github.com/food-swipe/internal/follow/core/ports"

type Core struct {
	storage ports.Storage
}

func New(storage ports.Storage) *Core {
	return &Core{
		storage: storage,
	}
}
