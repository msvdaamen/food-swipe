package dto

type CreateIngredientDto struct {
	Name string `json:"name" validate:"required"`
}
