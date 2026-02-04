package http

type AuthResponse struct {
	User  *UserResponse  `json:"user"`
	Token *TokenResponse `json:"token"`
}

type UserResponse struct {
	ID              string  `json:"id"`
	Email           string  `json:"email"`
	EmailVerified   bool    `json:"email_verified"`
	Username        string  `json:"username"`
	DisplayUsername *string `json:"display_username"`
	Name            string  `json:"name"`
	Image           *string `json:"image"`
	Role            string  `json:"role"`
	CreatedAt       string  `json:"created_at"`
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
	TokenType    string `json:"token_type"`
}

type MessageResponse struct {
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}
