package storage

import "github.com/jackc/pgx/v5/pgxpool"

type Storage struct {
	database *pgxpool.Pool
}

func New(database *pgxpool.Pool) *Storage {
	return &Storage{
		database: database,
	}
}
