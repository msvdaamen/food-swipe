package model

type CustomSessionClaims struct {
	PrimaryEmail string `json:"primaryEmail"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
}
