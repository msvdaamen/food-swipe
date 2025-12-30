package measurement

import (
	"context"
	"fmt"
)

const deleteMeasurementSql = `DELETE FROM measurements WHERE id = $1`

func (a *Measurement) DeleteMeasurement(ctx context.Context, id uint16) error {
	_, err := a.db.Exec(ctx, deleteMeasurementSql, id)
	if err != nil {
		return fmt.Errorf("failed to delete measurement: %w", err)
	}
	return nil
}
