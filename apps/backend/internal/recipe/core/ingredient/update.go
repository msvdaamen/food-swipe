package ingredient

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Ingredient) UpdateIngredient(ctx context.Context, id int32, payload models.UpdateIngredient) (models.Ingredient, error) {
	ingredient, err := a.storage.UpdateIngredient(ctx, id, payload)
	if err != nil {
		return models.Ingredient{}, fmt.Errorf("failed to update ingredient in storage: %w", err)
	}
	return ingredient, nil
}
