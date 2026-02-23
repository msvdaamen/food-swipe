package http

import (
	"time"

	"github.com/food-swipe/internal/user/core/models"
	"github.com/google/uuid"
)

type User struct {
	ID              uuid.UUID  `json:"id"`
	Name            string     `json:"name"`
	Email           string     `json:"email"`
	EmailVerified   bool       `json:"emailVerified"`
	Image           *string    `json:"image"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
	Username        string     `json:"username"`
	DisplayUsername string     `json:"displayUsername"`
	Role            string     `json:"role"`
	Banned          bool       `json:"banned"`
	BanReason       *string    `json:"banReason"`
	BanExpires      *time.Time `json:"banExpires"`
}

func userModelToApiModel(user models.User) User {
	return User{
		ID:              user.ID,
		Name:            user.Name,
		Email:           user.Email,
		EmailVerified:   user.EmailVerified,
		Image:           user.Image,
		CreatedAt:       user.CreatedAt,
		UpdatedAt:       user.UpdatedAt,
		Username:        user.Username,
		DisplayUsername: user.DisplayUsername,
		Role:            user.Role,
		Banned:          user.Banned,
		BanReason:       user.BanReason,
		BanExpires:      user.BanExpires,
	}
}
