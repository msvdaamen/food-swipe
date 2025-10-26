package todo

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

type Core struct {
}

func New(postgress *pgxpool.Pool) *Core {
	return &Core{}
}
