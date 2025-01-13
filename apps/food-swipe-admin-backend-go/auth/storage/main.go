package storage

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Storage struct {
	db *pgxpool.Pool
}

type RefreshToken struct {
	Id        string    `db:"id"`
	UserId    int32     `db:"user_id"`
	ExpiresAt time.Time `db:"expires_at"`
}

func NewStorage(db *pgxpool.Pool) *Storage {
	return &Storage{
		db,
	}
}
