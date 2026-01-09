package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
	"github.com/jackc/pgx/v5"
)

const updateRecipeStepSql = `
UPDATE recipe_steps
SET description = $1
WHERE recipe_id = $2 AND id = $3
RETURNING id, recipe_id, step_number, description
`

func (a *Recipe) UpdateRecipeStep(ctx context.Context, recipeID string, stepID uint32, payload models.UpdateRecipeStepInput) (*models.RecipeStep, error) {
	var step models.RecipeStep
	err := a.db.QueryRow(ctx, updateRecipeStepSql, payload.Description, recipeID, stepID).
		Scan(&step.ID, &step.RecipeID, &step.StepNumber, &step.Description)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("step not found")
		}
		return nil, fmt.Errorf("failed to update step: %w", err)
	}

	return &step, nil
}
