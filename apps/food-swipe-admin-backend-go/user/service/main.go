package service

import (
	"food-swipe.app/user/storage"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Service struct {
	storage *storage.Storage
}

type User struct {
	Id        int32     `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	IsAdmin   bool      `json:"isAdmin"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewService(db *pgxpool.Pool) *Service {
	userStorage := storage.NewStorage(db)
	return &Service{userStorage}
}
