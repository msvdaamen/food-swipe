package auth

import "errors"

var ErrUnauthorized = errors.New("unauthorized")

type User struct {
	ID string
}
