package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
	"github.com/google/uuid"
)

const createRecipeSql = `
INSERT INTO recipes (id, title, description, prep_time, servings, is_published)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id
`

func (a *Recipe) CreateRecipe(ctx context.Context, payload models.CreateRecipeInput) (*models.Recipe, error) {
	id := uuid.New().String()

	isPublished := false
	if payload.IsPublished != nil {
		isPublished = *payload.IsPublished
	}

	var recipeID string
	err := a.db.QueryRow(
		ctx,
		createRecipeSql,
		id,
		payload.Title,
		payload.Description,
		payload.PrepTime,
		payload.Servings,
		isPublished,
	).Scan(&recipeID)

	if err != nil {
		return nil, fmt.Errorf("failed to create recipe: %w", err)
	}

	recipe, err := a.GetRecipe(ctx, recipeID)
	if err != nil {
		return nil, fmt.Errorf("failed to get created recipe: %w", err)
	}
	return recipe, nil
}
