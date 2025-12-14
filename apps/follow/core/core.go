package core

import "github.com/food-swipe/follow/core/ports"

type Core struct {
	storage ports.Storage
}

func New(storage ports.Storage) *Core {
	return &Core{
		storage: storage,
	}
}
