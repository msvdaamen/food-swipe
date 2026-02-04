package models

// OAuthProvider represents the configuration for an OAuth provider
type OAuthProvider struct {
	Name         string
	ClientID     string
	ClientSecret string
	RedirectURL  string
	AuthURL      string
	TokenURL     string
	UserInfoURL  string
	Scopes       []string
}

// OAuthUserInfo represents the user information returned by OAuth providers
type OAuthUserInfo struct {
	ProviderUserID string
	Email          string
	EmailVerified  bool
	Name           string
	Picture        string
}

// PKCEChallenge represents the PKCE challenge for OAuth flow
type PKCEChallenge struct {
	CodeVerifier  string
	CodeChallenge string
	Method        string // S256 or plain
}

// OAuthAuthorizationRequest represents the parameters for OAuth authorization
type OAuthAuthorizationRequest struct {
	Provider     string
	State        string
	CodeVerifier string
	RedirectURI  string
}

// OAuthCallbackRequest represents the OAuth callback parameters
type OAuthCallbackRequest struct {
	Code         string
	State        string
	Provider     string
	CodeVerifier string
}
