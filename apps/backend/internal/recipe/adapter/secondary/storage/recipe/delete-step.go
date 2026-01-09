package recipe

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

const deleteRecipeStepSql = `
DELETE FROM recipe_steps
WHERE recipe_id = $1 AND id = $2
RETURNING step_number
`

const updateStepNumbersDownSql = `
UPDATE recipe_steps
SET step_number = step_number - 1
WHERE recipe_id = $1 AND step_number > $2
`

func (a *Recipe) DeleteRecipeStep(ctx context.Context, recipeID string, stepID uint32) error {
	tx, err := a.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// Delete step and get its step number
	var deletedStepNumber uint32
	err = tx.QueryRow(ctx, deleteRecipeStepSql, recipeID, stepID).Scan(&deletedStepNumber)
	if err != nil {
		if err == pgx.ErrNoRows {
			return fmt.Errorf("step not found")
		}
		return fmt.Errorf("failed to delete step: %w", err)
	}

	// Update remaining steps
	_, err = tx.Exec(ctx, updateStepNumbersDownSql, recipeID, deletedStepNumber)
	if err != nil {
		return fmt.Errorf("failed to update step numbers: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
