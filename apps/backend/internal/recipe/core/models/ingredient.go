package models

type Ingredient struct {
	ID   int32
	Name string
}

type CreateIngredient struct {
	Name string
}

type UpdateIngredient struct {
	Name string
}
