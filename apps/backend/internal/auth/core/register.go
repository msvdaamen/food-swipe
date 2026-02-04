package core

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/food-swipe/internal/auth/core/models"
	"github.com/food-swipe/internal/pkg/password"
	"github.com/google/uuid"
)

// Register creates a new user with email and password
func (c *Core) Register(ctx context.Context, email, pass, username, name string) (*models.AuthResponse, error) {
	// Validate email
	email = strings.ToLower(strings.TrimSpace(email))
	if email == "" {
		return nil, errors.New("email is required")
	}

	// Validate username
	username = strings.ToLower(strings.TrimSpace(username))
	if username == "" {
		return nil, errors.New("username is required")
	}

	// Check if user with email already exists
	existingUser, err := c.storage.GetUserByEmail(ctx, email)
	if err == nil && existingUser != nil {
		return nil, ErrUserAlreadyExists
	}

	// Check if username is taken
	existingUser, err = c.storage.GetUserByUsername(ctx, username)
	if err == nil && existingUser != nil {
		return nil, ErrUsernameAlreadyExists
	}

	// Hash password
	passwordHash, err := password.Hash(pass)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Create user
	user := &models.User{
		ID:            uuid.New(),
		Email:         email,
		EmailVerified: false,
		Username:      username,
		Name:          name,
		PasswordHash:  &passwordHash,
		Role:          "user",
		Banned:        false,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := c.storage.CreateUser(ctx, user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Generate tokens
	tokenPair, err := c.generateTokenPair(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tokens: %w", err)
	}

	return &models.AuthResponse{
		User:      user,
		TokenPair: tokenPair,
	}, nil
}
