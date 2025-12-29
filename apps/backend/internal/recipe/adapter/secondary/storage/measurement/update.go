package measurement

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const updateMeasurementSql = `UPDATE measurements SET name = $2, abbreviation = $3 WHERE id = $1 RETURNING id, name, abbreviation`

func (a *Measurement) UpdateMeasurement(ctx context.Context, id int16, payload models.UpdateMeasurement) (models.Measurement, error) {
	var measurement models.Measurement
	err := a.db.QueryRow(ctx, updateMeasurementSql, id, payload.Name, payload.Abbreviation).Scan(&measurement.ID, &measurement.Name, &measurement.Abbreviation)
	if err != nil {
		return models.Measurement{}, fmt.Errorf("failed to update measurement: %w", err)
	}
	return measurement, nil
}
