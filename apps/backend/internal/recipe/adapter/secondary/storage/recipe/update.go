package recipe

import (
	"context"
	"fmt"
	"strings"

	"github.com/food-swipe/internal/recipe/core/models"
)

func (a *Recipe) UpdateRecipe(ctx context.Context, id string, payload models.UpdateRecipeInput) (*models.Recipe, error) {
	params := []any{}
	updates := []string{}

	for _, path := range payload.FieldMask {
		switch path {
		case "title":
			params = append(params, *payload.Title)
			updates = append(updates, fmt.Sprintf("title = $%d", len(params)))
		case "description":
			params = append(params, *payload.Description)
			updates = append(updates, fmt.Sprintf("description = $%d", len(params)))
		case "prep_time":
			params = append(params, *payload.PrepTime)
			updates = append(updates, fmt.Sprintf("prep_time = $%d", len(params)))
		case "servings":
			params = append(params, *payload.Servings)
			updates = append(updates, fmt.Sprintf("servings = $%d", len(params)))
		case "isPublished":
			params = append(params, *payload.IsPublished)
			updates = append(updates, fmt.Sprintf("is_published = $%d", len(params)))
		case "coverImage":
			params = append(params, *payload.CoverImage)
			updates = append(updates, fmt.Sprintf("cover_image = $%d", len(params)))
		}
	}

	if len(updates) == 0 {
		return a.GetRecipe(ctx, id)
	}

	params = append(params, "NOW()")
	updates = append(updates, fmt.Sprintf("updated_at = $%d", len(params)))

	params = append(params, id)
	whereSql := fmt.Sprintf(" WHERE id = $%d", len(params))

	updateSql := "UPDATE recipes SET " + strings.Join(updates, ", ")
	updateSql += whereSql

	_, err := a.db.Exec(ctx, updateSql, params...)
	if err != nil {
		return nil, fmt.Errorf("failed to update recipe: %w", err)
	}

	recipe, err := a.GetRecipe(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get updated recipe: %w", err)
	}
	return recipe, nil
}
