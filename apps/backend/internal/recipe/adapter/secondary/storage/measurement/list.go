package measurement

import (
	"context"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Measurement) ListMeasurements(ctx context.Context) ([]models.Measurement, error) {
	return []models.Measurement{}, nil
}
