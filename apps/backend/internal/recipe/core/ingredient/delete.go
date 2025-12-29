package ingredient

import (
	"context"
	"fmt"
)

func (a *Ingredient) DeleteIngredient(ctx context.Context, id int32) error {
	err := a.storage.DeleteIngredient(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to delete ingredient from storage: %w", err)
	}
	return nil
}
