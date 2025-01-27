package jwt

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type Jwt struct {
	secret string
}

type ParseOptions struct {
	ExpiresAt time.Time
	Subject   string
	Issuer    string
}

func New(secret string) *Jwt {
	return &Jwt{secret: secret}
}

func (s *Jwt) Parse(payload ParseOptions) (*string, error) {
	claims := jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(payload.ExpiresAt),
		Subject:   payload.Subject,
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(s.secret))
	if err != nil {
		return nil, fmt.Errorf("error signing token: %w", err)
	}
	return &tokenString, nil
}

func (s *Jwt) Verify(tokenString string) (*jwt.Token, error) {
	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.secret), nil
	})
	if err != nil {
		return nil, fmt.Errorf("error parsing token: %w", err)
	}
	return token, nil
}
