package ingredient

import (
	"context"
	"fmt"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Ingredient) ListIngredients(ctx context.Context, payload models.ListIngredients) (*pagination.PaginationResponse[models.Ingredient], error) {
	ingredients, err := a.storage.ListIngredients(ctx, payload)
	if err != nil {
		return nil, fmt.Errorf("failed to list ingredients from storage: %w", err)
	}
	return ingredients, nil
}
