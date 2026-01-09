package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) GetRecipe(ctx context.Context, id string) (*models.Recipe, error) {
	recipe, err := r.storage.GetRecipe(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get recipe: %w", err)
	}
	return recipe, nil
}
