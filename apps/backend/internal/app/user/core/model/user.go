package model

import "time"

type User struct {
	ID        string
	Email     string
	FirstName string
	LastName  string
	CreatedAt time.Time
}

type CreateUserPayload struct {
	ID        string
	AuthID    string
	Email     string
	FirstName string
	LastName  string
	CreatedAt time.Time
}
