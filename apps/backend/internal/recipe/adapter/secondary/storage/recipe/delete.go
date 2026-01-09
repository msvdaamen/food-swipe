package recipe

import (
	"context"
	"fmt"
)

const deleteRecipeSql = "DELETE FROM recipes WHERE id = $1"

func (a *Recipe) DeleteRecipe(ctx context.Context, id string) error {
	_, err := a.db.Exec(ctx, deleteRecipeSql, id)
	if err != nil {
		return fmt.Errorf("failed to delete recipe: %w", err)
	}
	return nil
}
