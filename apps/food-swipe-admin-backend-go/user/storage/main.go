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
	Id        int32     `db:"id"`
	Email     string    `db:"email"`
	Username  string    `db:"username"`
	Password  string    `db:"password"`
	FirstName string    `db:"first_name"`
	LastName  string    `db:"last_name"`
	IsAdmin   bool      `db:"is_admin"`
	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`
}

func NewStorage(db *pgxpool.Pool) *Storage {
	return &Storage{
		db,
	}
}
