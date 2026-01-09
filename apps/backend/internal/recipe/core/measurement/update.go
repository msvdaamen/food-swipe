package measurement

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Measurement) UpdateMeasurement(ctx context.Context, id uint16, payload models.UpdateMeasurement) (models.Measurement, error) {
	measurement, err := a.storage.UpdateMeasurement(ctx, id, payload)
	if err != nil {
		return models.Measurement{}, fmt.Errorf("failed to update measurement in storage: %w", err)
	}
	return measurement, nil
}
