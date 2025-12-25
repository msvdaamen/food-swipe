package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID              uuid.UUID
	Name            string
	Email           string
	EmailVerified   bool
	Image           *string
	Username        string
	DisplayUsername *string
	Role            string
	Banned          bool
	BanReason       *string
	BanExpires      *time.Time
	CreatedAt       time.Time
	UpdatedAt       time.Time
}
