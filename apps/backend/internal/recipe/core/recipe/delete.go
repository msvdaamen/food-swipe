package recipe

import (
	"context"
	"fmt"
)

func (r *Recipe) DeleteRecipe(ctx context.Context, id string) error {
	err := r.storage.DeleteRecipe(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to delete recipe: %w", err)
	}
	return nil
}
