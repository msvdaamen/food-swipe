package core

import "github.com/msvdaamen/food-swipe/internal/app/user/core/port"

type Core struct {
	storage port.Storage
}

func New(storage port.Storage) *Core {
	return &Core{
		storage: storage,
	}
}
