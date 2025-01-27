package service

import (
	"food-swipe.app/ingredient/storage"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Ingredient struct {
	Id   int32  `json:"id"`
	Name string `json:"name"`
}

type Service struct {
	storage *storage.Storage
}

func New(db *pgxpool.Pool) *Service {
	return &Service{
		storage: storage.NewStorage(db),
	}
}
