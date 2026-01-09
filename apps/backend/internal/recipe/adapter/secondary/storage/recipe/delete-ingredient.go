package recipe

import (
	"context"
	"fmt"
)

const deleteRecipeIngredientSql = `
DELETE FROM recipe_ingredients
WHERE recipe_id = $1 AND ingredient_id = $2
`

func (a *Recipe) DeleteRecipeIngredient(ctx context.Context, recipeID string, ingredientID uint32) error {
	result, err := a.db.Exec(ctx, deleteRecipeIngredientSql, recipeID, ingredientID)
	if err != nil {
		return fmt.Errorf("failed to delete recipe ingredient: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("recipe ingredient not found")
	}

	return nil
}
