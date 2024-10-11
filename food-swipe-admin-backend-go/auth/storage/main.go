package storage

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Storage struct {
	db *pgxpool.Pool
}

type RefreshToken struct {
	Id        string
	UserId    int32
	ExpiresAt time.Time
}

func NewStorage(db *pgxpool.Pool) *Storage {
	return &Storage{
		db,
	}
}
