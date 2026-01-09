package measurement

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Measurement) CreateMeasurement(ctx context.Context, payload models.CreateMeasurement) (models.Measurement, error) {
	measurement, err := a.storage.CreateMeasurement(ctx, payload)
	if err != nil {
		return models.Measurement{}, fmt.Errorf("failed to create measurement in storage: %w", err)
	}
	return measurement, nil
}
