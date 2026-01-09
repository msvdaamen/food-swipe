package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const createRecipeStepSql = `
INSERT INTO recipe_steps (recipe_id, step_number, description)
VALUES ($1, $2, $3)
RETURNING id, recipe_id, step_number, description
`

const updateStepNumbersUpSql = `
UPDATE recipe_steps
SET step_number = step_number + 1
WHERE recipe_id = $1 AND step_number >= $2
`

func (a *Recipe) CreateRecipeStep(ctx context.Context, recipeID string, payload models.CreateRecipeStepInput) (*models.RecipeStep, error) {
	tx, err := a.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// Update existing steps to make room
	_, err = tx.Exec(ctx, updateStepNumbersUpSql, recipeID, payload.Order)
	if err != nil {
		return nil, fmt.Errorf("failed to update step numbers: %w", err)
	}

	// Insert new step
	var step models.RecipeStep
	err = tx.QueryRow(ctx, createRecipeStepSql, recipeID, payload.Order, payload.Description).
		Scan(&step.ID, &step.RecipeID, &step.StepNumber, &step.Description)
	if err != nil {
		return nil, fmt.Errorf("failed to create step: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return &step, nil
}
