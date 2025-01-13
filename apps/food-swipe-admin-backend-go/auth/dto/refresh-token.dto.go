package dto

type RefreshTokenDto struct {
	RefreshToken string `json:"refreshToken" validate:"required"`
}
