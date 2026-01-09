package models

import "time"

type Recipe struct {
	ID          string
	Title       string
	Description *string
	PrepTime    *uint32
	Servings    *uint32
	IsPublished bool
	CoverImage  *string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Nutritions  []Nutrition
}

type RecipeStep struct {
	ID          uint32
	RecipeID    string
	StepNumber  uint32
	Description string
}

type RecipeIngredient struct {
	RecipeID      string
	IngredientID  uint32
	MeasurementID *uint32
	Amount        uint32
	Ingredient    string
	Measurement   *string
}

type Nutrition struct {
	ID       uint32
	RecipeID string
	Name     string
	Unit     string
	Value    uint32
}

type CreateRecipeInput struct {
	Title       string
	Description *string
	PrepTime    *uint32
	Servings    *uint32
	IsPublished *bool
}

type UpdateRecipeInput struct {
	Title       *string
	Description *string
	PrepTime    *uint32
	Servings    *uint32
	IsPublished *bool
}

type ListRecipesFilter struct {
	Page        uint32
	Limit       uint32
	IsPublished *bool
}

type CreateRecipeStepInput struct {
	Order       uint32
	Description string
}

type UpdateRecipeStepInput struct {
	Description string
}

type ReorderRecipeStepInput struct {
	OrderFrom uint32
	OrderTo   uint32
}

type CreateRecipeIngredientInput struct {
	IngredientID  uint32
	MeasurementID *uint32
	Amount        uint32
}

type UpdateRecipeIngredientInput struct {
	MeasurementID *uint32
	Amount        uint32
}

type UpdateNutritionInput struct {
	Name  string
	Unit  string
	Value uint32
}
