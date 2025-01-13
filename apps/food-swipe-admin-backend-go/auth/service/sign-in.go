package service

import (
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"food-swipe.app/auth/dto"
	"golang.org/x/crypto/argon2"
	"strings"
)

type SignInResponse struct {
	User         AuthUser `json:"user"`
	AccessToken  string   `json:"accessToken"`
	RefreshToken string   `json:"refreshToken"`
}

type ArgonParams struct {
	memory      uint32
	iterations  uint32
	parallelism uint8
	saltLength  uint32
	keyLength   uint32
}

//	var argonParams = ArgonParams{
//		memory:      64 * 1024,
//		iterations:  3,
//		parallelism: 2,
//		saltLength:  16,
//		keyLength:   32,
//	}
var (
	ErrInvalidHash         = errors.New("the encoded hash is not in the correct format")
	ErrIncompatibleVersion = errors.New("incompatible version of argon2")
)

func (s *Service) SignIn(payload dto.SignInDto) (*SignInResponse, error) {
	user, err := s.userService.GetUserByEmail(payload.Email)
	if err != nil {
		return nil, fmt.Errorf("error getting user by email: %w", err)
	}
	if !user.IsAdmin {
		return nil, fmt.Errorf("user is not an admin")
	}
	match, err := comparePasswordAndHash(payload.Password, user.Password)
	if err != nil {
		return nil, fmt.Errorf("error comparing password and hash: %w", err)
	}
	if !match {
		return nil, fmt.Errorf("passwords do not match")
	}

	accessToken, err := s.createAccessToken(user.Id)
	if err != nil {
		return nil, fmt.Errorf("error creating access token for user: %d, %w", user.Id, err)
	}
	refreshToken, err := s.createRefreshToken(user.Id)
	if err != nil {
		return nil, fmt.Errorf("error creating access token for user: %d, %w", user.Id, err)
	}

	return &SignInResponse{
		User:         UserToAuthUser(*user),
		AccessToken:  *accessToken,
		RefreshToken: *refreshToken,
	}, nil
}

func comparePasswordAndHash(password, encodedHash string) (match bool, err error) {
	// Extract the parameters, salt and derived key from the encoded password
	// hash.
	p, salt, hash, err := decodeHash(encodedHash)
	if err != nil {
		return false, err
	}

	// Derive the key from the other password using the same parameters.
	otherHash := argon2.IDKey([]byte(password), salt, p.iterations, p.memory, p.parallelism, p.keyLength)

	// Check that the contents of the hashed passwords are identical. Note
	// that we are using the subtle.ConstantTimeCompare() function for this
	// to help prevent timing attacks.
	if subtle.ConstantTimeCompare(hash, otherHash) == 1 {
		return true, nil
	}
	return false, nil
}

func decodeHash(encodedHash string) (p *ArgonParams, salt, hash []byte, err error) {
	vals := strings.Split(encodedHash, "$")
	if len(vals) != 6 {
		return nil, nil, nil, ErrInvalidHash
	}

	var version int
	_, err = fmt.Sscanf(vals[2], "v=%d", &version)
	if err != nil {
		return nil, nil, nil, err
	}
	if version != argon2.Version {
		return nil, nil, nil, ErrIncompatibleVersion
	}

	p = &ArgonParams{}
	_, err = fmt.Sscanf(vals[3], "m=%d,t=%d,p=%d", &p.memory, &p.iterations, &p.parallelism)
	if err != nil {
		return nil, nil, nil, err
	}

	salt, err = base64.RawStdEncoding.Strict().DecodeString(vals[4])
	if err != nil {
		return nil, nil, nil, err
	}
	p.saltLength = uint32(len(salt))

	hash, err = base64.RawStdEncoding.Strict().DecodeString(vals[5])
	if err != nil {
		return nil, nil, nil, err
	}
	p.keyLength = uint32(len(hash))

	return p, salt, hash, nil
}
