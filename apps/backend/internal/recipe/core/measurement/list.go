package measurement

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Measurement) ListMeasurements(ctx context.Context, payload models.ListMeasurements) (*pagination.PaginationResponse[models.Measurement], error) {
	measurements, err := a.storage.ListMeasurements(ctx, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to list measurements from storage: %w", err)
	}
	return measurements, nil
}
