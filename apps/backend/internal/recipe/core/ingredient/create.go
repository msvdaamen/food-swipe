package ingredient

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Ingredient) CreateIngredient(ctx context.Context, payload models.CreateIngredient) (models.Ingredient, error) {
	ingredient, err := a.storage.CreateIngredient(ctx, payload)
	if err != nil {
		return models.Ingredient{}, fmt.Errorf("failed to create ingredient in storage: %w", err)
	}
	return ingredient, nil
}
