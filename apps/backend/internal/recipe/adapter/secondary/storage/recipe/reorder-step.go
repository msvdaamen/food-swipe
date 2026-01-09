package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const updateStepNumbersSql = `
UPDATE recipe_steps
SET step_number = $1
WHERE recipe_id = $2 AND id = $3
`

func (a *Recipe) ReorderRecipeStep(ctx context.Context, recipeID string, stepID uint32, payload models.ReorderRecipeStepInput) ([]models.RecipeStep, error) {
	if payload.OrderTo == payload.OrderFrom {
		return a.ListRecipeSteps(ctx, recipeID)
	}

	tx, err := a.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// Check if step exists
	var exists bool
	err = tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM recipe_steps WHERE id = $1 AND recipe_id = $2)", stepID, recipeID).Scan(&exists)
	if err != nil || !exists {
		return nil, fmt.Errorf("step not found")
	}

	if payload.OrderTo < payload.OrderFrom {
		// Moving up: increment steps between new and old position
		_, err = tx.Exec(ctx, `
			UPDATE recipe_steps
			SET step_number = step_number + 1
			WHERE recipe_id = $1 AND step_number >= $2 AND step_number < $3
		`, recipeID, payload.OrderTo, payload.OrderFrom)
	} else {
		// Moving down: decrement steps between old and new position
		_, err = tx.Exec(ctx, `
			UPDATE recipe_steps
			SET step_number = step_number - 1
			WHERE recipe_id = $1 AND step_number > $2 AND step_number <= $3
		`, recipeID, payload.OrderFrom, payload.OrderTo)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to update step numbers: %w", err)
	}

	// Update the moved step
	_, err = tx.Exec(ctx, updateStepNumbersSql, payload.OrderTo, recipeID, stepID)
	if err != nil {
		return nil, fmt.Errorf("failed to update step: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	steps, err := a.ListRecipeSteps(ctx, recipeID)
	if err != nil {
		return nil, fmt.Errorf("failed to list recipe steps after reorder: %w", err)
	}
	return steps, nil
}
