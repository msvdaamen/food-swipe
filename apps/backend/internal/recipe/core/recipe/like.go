package recipe

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (r *Recipe) LikeRecipe(ctx context.Context, userID string, recipeID string, like bool) (*models.Recipe, error) {
	recipe, err := r.storage.LikeRecipe(ctx, userID, recipeID, like)
	if err != nil {
		return nil, fmt.Errorf("failed to like recipe: %w", err)
	}
	return recipe, nil
}
