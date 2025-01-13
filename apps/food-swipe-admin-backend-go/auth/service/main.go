package service

import (
	"food-swipe.app/auth/storage"
	"food-swipe.app/common/jwt"
	user "food-swipe.app/user/service"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Service struct {
	storage     *storage.Storage
	userService *user.Service
	jwtService  *jwt.Jwt
}

type AuthUser struct {
	Id        int32     `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	IsAdmin   bool      `json:"isAdmin"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewService(dbPool *pgxpool.Pool, userService *user.Service, jwtService *jwt.Jwt) *Service {
	authStorage := storage.NewStorage(dbPool)
	return &Service{
		authStorage,
		userService,
		jwtService,
	}
}
