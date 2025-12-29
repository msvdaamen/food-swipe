package ingredient

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Ingredient) GetIngredient(ctx context.Context, id int32) (models.Ingredient, error) {
	ingredient, err := a.storage.GetIngredient(ctx, id)
	if err != nil {
		return models.Ingredient{}, fmt.Errorf("failed to get ingredient from storage: %w", err)
	}
	return ingredient, nil
}
