package recipe

import (
	"context"
	"fmt"
)

func (r *Recipe) DeleteRecipeIngredient(ctx context.Context, recipeID string, ingredientID uint32) error {
	err := r.storage.DeleteRecipeIngredient(ctx, recipeID, ingredientID)
	if err != nil {
		return fmt.Errorf("failed to delete recipe ingredient: %w", err)
	}
	return nil
}
