package ingredient

import (
	"context"
	"fmt"
)

const deleteIngredientSql = "DELETE FROM ingredients WHERE id = $1"

func (a *Ingredient) DeleteIngredient(ctx context.Context, id int32) error {
	_, err := a.db.Exec(ctx, deleteIngredientSql, id)
	if err != nil {
		return fmt.Errorf("failed to delete ingredient: %w", err)
	}
	return nil
}
