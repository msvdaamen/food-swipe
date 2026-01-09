package core

import "github.com/food-swipe/internal/user/core/port"

type Core struct {
	storage port.Storage
}

func New(storage port.Storage) *Core {
	return &Core{
		storage: storage,
	}
}
