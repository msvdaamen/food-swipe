package storage

import (
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Adapter struct {
	db *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Adapter {
	return &Adapter{
		db: pool,
	}
}

var ErrUserNotFound = errors.New("User not found")
