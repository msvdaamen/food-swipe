package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

const listRecipeStepsSql = `
SELECT id, recipe_id, step_number, description
FROM recipe_steps
WHERE recipe_id = $1
ORDER BY step_number
`

func (a *Recipe) ListRecipeSteps(ctx context.Context, recipeID string) ([]models.RecipeStep, error) {
	rows, err := a.db.Query(ctx, listRecipeStepsSql, recipeID)
	if err != nil {
		return nil, fmt.Errorf("failed to read rows: %w", err)
	}
	defer rows.Close()

	steps := []models.RecipeStep{}
	for rows.Next() {
		var step models.RecipeStep
		err := rows.Scan(&step.ID, &step.RecipeID, &step.StepNumber, &step.Description)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		steps = append(steps, step)
	}

	return steps, nil
}
