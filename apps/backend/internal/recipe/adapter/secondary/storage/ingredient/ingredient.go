package ingredient

import "github.com/jackc/pgx/v5/pgxpool"

type Ingredient struct {
	db *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Ingredient {
	return &Ingredient{db: pool}
}
