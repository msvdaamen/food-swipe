package measurement

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const getMeasurementSql = `SELECT id, name, abbreviation FROM measurements WHERE id = $1`

func (a *Measurement) GetMeasurement(ctx context.Context, id uint16) (models.Measurement, error) {
	var measurement models.Measurement
	err := a.db.QueryRow(ctx, getMeasurementSql, id).Scan(&measurement.ID, &measurement.Name, &measurement.Abbreviation)
	if err != nil {
		return models.Measurement{}, fmt.Errorf("failed to get measurement: %w", err)
	}
	return measurement, nil
}
