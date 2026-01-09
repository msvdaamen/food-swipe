package measurement

import (
	"context"
	"fmt"
)

func (a *Measurement) DeleteMeasurement(ctx context.Context, id uint16) error {
	err := a.storage.DeleteMeasurement(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to delete measurement in storage: %w", err)
	}
	return nil
}
