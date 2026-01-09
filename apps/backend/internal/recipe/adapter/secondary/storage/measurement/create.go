package measurement

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const createMeasurementSql = `INSERT INTO measurements (name, abbreviation) VALUES ($1, $2) RETURNING id, name, abbreviation`

func (a *Measurement) CreateMeasurement(ctx context.Context, payload models.CreateMeasurement) (models.Measurement, error) {

	row := a.db.QueryRow(ctx, createMeasurementSql, payload.Name, payload.Abbreviation)
	var measurement models.Measurement
	err := row.Scan(&measurement.ID, &measurement.Name, &measurement.Abbreviation)
	if err != nil {
		return models.Measurement{}, fmt.Errorf("failed to scan row: %w", err)
	}
	return measurement, nil
}
