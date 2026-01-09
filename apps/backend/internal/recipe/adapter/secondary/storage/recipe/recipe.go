package recipe

import "github.com/jackc/pgx/v5/pgxpool"

type Recipe struct {
	db *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Recipe {
	return &Recipe{db: pool}
}
