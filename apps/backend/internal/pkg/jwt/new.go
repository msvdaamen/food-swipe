package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func (a *JWT) New(sub string, exp time.Time) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": sub,
		"exp": exp.Unix(),
	})
	signedToken, err := token.SignedString(a.secret)
	if err != nil {
		return "", err
	}
	return signedToken, nil
}
