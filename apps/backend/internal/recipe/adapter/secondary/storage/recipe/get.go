package recipe

import (
	"context"
	"fmt"
	"time"

	"github.com/food-swipe/internal/recipe/core/models"
)

const getRecipeSql = `
SELECT
	r.id, r.title, r.description, r.prep_time, r.servings,
	r.is_published, r.cover_image, r.created_at, r.updated_at,
	n.id as nutrition_id, n.name as nutrition_name, n.unit as nutrition_unit, n.value as nutrition_value
FROM recipes r
LEFT JOIN recipe_nutritions n ON r.id = n.recipe_id
WHERE r.id = $1
`

func (a *Recipe) GetRecipe(ctx context.Context, id string) (*models.Recipe, error) {
	rows, err := a.db.Query(ctx, getRecipeSql, id)
	if err != nil {
		return nil, fmt.Errorf("failed to read rows: %w", err)
	}
	defer rows.Close()

	var recipe *models.Recipe

	for rows.Next() {
		var (
			recipeID       string
			title          string
			description    *string
			prepTime       *uint32
			servings       *uint32
			isPublished    bool
			coverImage     *string
			createdAt      time.Time
			updatedAt      time.Time
			nutritionID    *uint32
			nutritionName  *string
			nutritionUnit  *string
			nutritionValue *uint32
		)

		err := rows.Scan(
			&recipeID, &title, &description, &prepTime, &servings,
			&isPublished, &coverImage, &createdAt, &updatedAt,
			&nutritionID, &nutritionName, &nutritionUnit, &nutritionValue,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		if recipe == nil {
			recipe = &models.Recipe{
				ID:          recipeID,
				Title:       title,
				Description: description,
				PrepTime:    prepTime,
				Servings:    servings,
				IsPublished: isPublished,
				CoverImage:  coverImage,
				Nutritions:  []models.Nutrition{},
				CreatedAt:   createdAt,
				UpdatedAt:   updatedAt,
			}
		}

		if nutritionID != nil && nutritionName != nil && nutritionUnit != nil && nutritionValue != nil {
			recipe.Nutritions = append(recipe.Nutritions, models.Nutrition{
				ID:       *nutritionID,
				RecipeID: recipeID,
				Name:     *nutritionName,
				Unit:     *nutritionUnit,
				Value:    *nutritionValue,
			})
		}
	}

	if recipe == nil {
		return nil, fmt.Errorf("recipe not found")
	}

	return recipe, nil
}
