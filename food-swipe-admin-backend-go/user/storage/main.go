package storage

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Storage struct {
	db *pgxpool.Pool
}

var userFields = []string{
	"id", "email", "username", "password", "first_name", "last_name", "is_admin", "created_at", "updated_at",
}

type User struct {
	Id        int32
	Email     string
	Username  string
	Password  string
	FirstName string
	LastName  string
	IsAdmin   bool
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewStorage(db *pgxpool.Pool) *Storage {
	return &Storage{
		db,
	}
}
