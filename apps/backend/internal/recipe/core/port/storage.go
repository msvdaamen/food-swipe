package port

import (
	"context"

	"github.com/food-swipe/internal/recipe/core/models"
)

type IngredientStorage interface {
	ListIngredients(context.Context) ([]models.Ingredient, error)
	GetIngredient(ctx context.Context, id int32) (models.Ingredient, error)
	CreateIngredient(ctx context.Context, payload models.CreateIngredient) (models.Ingredient, error)
	UpdateIngredient(ctx context.Context, id int32, payload models.UpdateIngredient) (models.Ingredient, error)
	DeleteIngredient(ctx context.Context, id int32) error
}

type MeasurementStorage interface {
	ListMeasurements(context.Context) ([]models.Measurement, error)
	GetMeasurement(ctx context.Context, id int16) (models.Measurement, error)
	CreateMeasurement(ctx context.Context, payload models.CreateMeasurement) (models.Measurement, error)
	UpdateMeasurement(ctx context.Context, id int16, payload models.UpdateMeasurement) (models.Measurement, error)
	DeleteMeasurement(ctx context.Context, id int16) error
}

type Storage interface {
	IngredientStorage
	MeasurementStorage
}
