package models

type Ingredient struct {
	ID   uint32
	Name string
}

type ListIngredients struct {
	Limit  uint32
	Page   uint32
	Search *string
}

type CreateIngredient struct {
	Name string
}

type UpdateIngredient struct {
	Name string
}
