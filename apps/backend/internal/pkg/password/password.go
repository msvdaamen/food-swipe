package password

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidPassword = errors.New("invalid password")
	ErrPasswordTooWeak = errors.New("password is too weak")
)

const (
	MinPasswordLength = 8
	MaxPasswordLength = 128
	BcryptCost        = 12
)

// Hash generates a bcrypt hash of the password
func Hash(password string) (string, error) {
	if err := Validate(password); err != nil {
		return "", err
	}

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), BcryptCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}

	return string(hashedBytes), nil
}

// Verify checks if the provided password matches the hash
func Verify(password, hash string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return ErrInvalidPassword
		}
		return fmt.Errorf("failed to verify password: %w", err)
	}
	return nil
}

// Validate checks if the password meets minimum requirements
func Validate(password string) error {
	if len(password) < MinPasswordLength {
		return fmt.Errorf("%w: password must be at least %d characters long", ErrPasswordTooWeak, MinPasswordLength)
	}

	if len(password) > MaxPasswordLength {
		return fmt.Errorf("%w: password must not exceed %d characters", ErrPasswordTooWeak, MaxPasswordLength)
	}

	// Additional validation rules can be added here
	// For example: checking for uppercase, lowercase, numbers, special characters

	return nil
}

// NeedsRehash checks if a password hash needs to be rehashed (e.g., if cost has changed)
func NeedsRehash(hash string) bool {
	cost, err := bcrypt.Cost([]byte(hash))
	if err != nil {
		return true
	}
	return cost != BcryptCost
}

// GenerateRandomPassword generates a cryptographically secure random password
func GenerateRandomPassword(length int) (string, error) {
	if length < MinPasswordLength {
		length = MinPasswordLength
	}

	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("failed to generate random password: %w", err)
	}

	return base64.URLEncoding.EncodeToString(bytes)[:length], nil
}
