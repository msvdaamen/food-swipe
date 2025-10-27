package jwt

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

func (a *JWT) Verify(tokenString string) (*jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return a.secret, nil
	}, jwt.WithValidMethods([]string{"HS256", "HS384", "HS512"}))
	if err != nil {
		return nil, err
	}
	if token.Valid {
		return nil, errors.New("invalid token")
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		a.logger.Error("failed to parse claims")
		return nil, errors.New("something went wrong")
	}
	return &claims, errors.New("invalid token")
}
