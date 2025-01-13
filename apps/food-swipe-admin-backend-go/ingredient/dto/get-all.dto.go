package dto

type GetAll struct {
	Search *string `json:"search"`
	Sort   *string `json:"sort"`
	Order  *string `json:"order"`
	Page   uint    `json:"page" validate:"required"`
	Amount uint    `json:"amount" validate:"required"`
}
