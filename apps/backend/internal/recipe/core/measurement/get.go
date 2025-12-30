package measurement

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Measurement) GetMeasurement(ctx context.Context, id uint16) (models.Measurement, error) {
	measurement, err := a.storage.GetMeasurement(ctx, id)
	if err != nil {
		return models.Measurement{}, fmt.Errorf("failed to get measurement from storage: %w", err)
	}
	return measurement, nil
}
