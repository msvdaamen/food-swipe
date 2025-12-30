package measurement

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/recipe/core/models"
)

const listMeasurementsSql = "SELECT id, name, abbreviation FROM measurements"
const countMeasurementsSql = "SELECT COUNT(*) FROM ingredients"

func (a *Measurement) ListMeasurements(ctx context.Context, payload models.ListMeasurements) (*pagination.PaginationResponse[models.Measurement], error) {
	params := []any{}
	countParams := []any{}

	filterSql := ""

	if payload.Search != nil {
		filterSql += fmt.Sprintf(" WHERE name LIKE $%d", len(params)+1)
		params = append(params, fmt.Sprintf("%%%s%%", *payload.Search))
		countParams = append(countParams, fmt.Sprintf("%%%s%%", *payload.Search))
	}

	limitSql := fmt.Sprintf(" LIMIT $%d OFFSET $%d", len(params)+1, len(params)+2)
	params = append(params, payload.Limit, (payload.Page-1)*payload.Limit)

	rows, err := a.db.Query(ctx, listMeasurementsSql+filterSql+limitSql, params...)
	if err != nil {
		return nil, fmt.Errorf("failed to read rows: %w", err)
	}
	defer rows.Close()
	measurements := []models.Measurement{}
	for rows.Next() {
		var measurement models.Measurement
		err := rows.Scan(&measurement.ID, &measurement.Name, &measurement.Abbreviation)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		measurements = append(measurements, measurement)
	}

	var count uint32
	err = a.db.QueryRow(ctx, countMeasurementsSql+filterSql, countParams...).Scan(&count)
	if err != nil {
		return nil, fmt.Errorf("failed to count rows: %w", err)
	}

	return pagination.New(measurements, count, payload.Page, payload.Limit), nil
}
