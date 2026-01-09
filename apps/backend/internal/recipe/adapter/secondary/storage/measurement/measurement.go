package measurement

import "github.com/jackc/pgx/v5/pgxpool"

type Measurement struct {
	db *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Measurement {
	return &Measurement{db: pool}
}
