package storage

import "github.com/jackc/pgx/v5/pgxpool"

type Storage struct {
	db *pgxpool.Pool
}

var ingredientFields = []string{
	"id", "name",
}

type Ingredient struct {
	Id   int32
	Name string
}

func NewStorage(db *pgxpool.Pool) *Storage {
	return &Storage{
		db,
	}
}
