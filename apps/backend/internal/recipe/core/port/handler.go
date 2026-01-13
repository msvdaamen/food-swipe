package port

import (
	"context"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/recipe/core/models"
)

type IngredientHandler interface {
	ListIngredients(context.Context, models.ListIngredients) (*pagination.PaginationResponse[models.Ingredient], error)
	GetIngredient(ctx context.Context, id uint32) (models.Ingredient, error)
	CreateIngredient(context.Context, models.CreateIngredient) (models.Ingredient, error)
	UpdateIngredient(ctx context.Context, id uint32, payload models.UpdateIngredient) (models.Ingredient, error)
	DeleteIngredient(ctx context.Context, id uint32) error
}

type MeasurementHandler interface {
	ListMeasurements(context.Context, models.ListMeasurements) (*pagination.PaginationResponse[models.Measurement], error)
	GetMeasurement(ctx context.Context, id uint16) (models.Measurement, error)
	CreateMeasurement(context.Context, models.CreateMeasurement) (models.Measurement, error)
	UpdateMeasurement(ctx context.Context, id uint16, payload models.UpdateMeasurement) (models.Measurement, error)
	DeleteMeasurement(ctx context.Context, id uint16) error
}

type RecipeHandler interface {
	// Recipe operations
	ListRecipes(ctx context.Context, filter models.ListRecipesFilter) (*pagination.PaginationResponse[models.Recipe], error)
	GetRecipe(ctx context.Context, id string) (*models.Recipe, error)
	CreateRecipe(ctx context.Context, payload models.CreateRecipeInput) (*models.Recipe, error)
	UpdateRecipe(ctx context.Context, id string, payload models.UpdateRecipeInput) (*models.Recipe, error)
	DeleteRecipe(ctx context.Context, id string) error
	UploadRecipeImage(ctx context.Context, id string, data []byte) (*models.Recipe, error)

	// Recipe Steps operations
	ListRecipeSteps(ctx context.Context, recipeID string) ([]models.RecipeStep, error)
	CreateRecipeStep(ctx context.Context, recipeID string, payload models.CreateRecipeStepInput) (*models.RecipeStep, error)
	UpdateRecipeStep(ctx context.Context, recipeID string, stepID uint32, payload models.UpdateRecipeStepInput) (*models.RecipeStep, error)
	DeleteRecipeStep(ctx context.Context, recipeID string, stepID uint32) error
	ReorderRecipeStep(ctx context.Context, recipeID string, stepID uint32, payload models.ReorderRecipeStepInput) ([]models.RecipeStep, error)

	// Recipe Ingredients operations
	ListRecipeIngredients(ctx context.Context, recipeID string) ([]models.RecipeIngredient, error)
	GetRecipeIngredient(ctx context.Context, recipeID string, ingredientID uint32) (*models.RecipeIngredient, error)
	CreateRecipeIngredient(ctx context.Context, recipeID string, payload models.CreateRecipeIngredientInput) (*models.RecipeIngredient, error)
	UpdateRecipeIngredient(ctx context.Context, recipeID string, ingredientID uint32, payload models.UpdateRecipeIngredientInput) (*models.RecipeIngredient, error)
	DeleteRecipeIngredient(ctx context.Context, recipeID string, ingredientID uint32) error

	// Recipe Nutritions operations
	ListRecipeNutritions(ctx context.Context, recipeID string) ([]models.Nutrition, error)
	UpdateRecipeNutrition(ctx context.Context, recipeID string, payload models.UpdateNutritionInput) (*models.Nutrition, error)

	// Like operations
	LikeRecipe(ctx context.Context, userID string, recipeID string, like bool) (*models.Recipe, error)
}

type Handler interface {
	IngredientHandler
	MeasurementHandler
	RecipeHandler
}
