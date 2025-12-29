package ingredient

import (
	"context"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Ingredient) ListIngredients(ctx context.Context) ([]models.Ingredient, error) {
	return []models.Ingredient{}, nil
}
