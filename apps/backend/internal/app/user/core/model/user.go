package model

import "time"

type User struct {
	ID        string
	AuthID    string
	Email     string
	CreatedAt time.Time
}

type CreateUserPayload struct {
	ID        string
	AuthID    string
	Email     string
	CreatedAt time.Time
}
