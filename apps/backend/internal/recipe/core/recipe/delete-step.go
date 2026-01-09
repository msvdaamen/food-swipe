package recipe

import (
	"context"
	"fmt"
)

func (r *Recipe) DeleteRecipeStep(ctx context.Context, recipeID string, stepID uint32) error {
	err := r.storage.DeleteRecipeStep(ctx, recipeID, stepID)
	if err != nil {
		return fmt.Errorf("failed to delete recipe step: %w", err)
	}
	return nil
}
