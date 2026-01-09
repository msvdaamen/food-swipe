package recipe

import (
	"context"
	"fmt"
	"time"

	"github.com/food-swipe/internal/pkg/models/pagination"
	"github.com/food-swipe/internal/recipe/core/models"
)

const listRecipesSql = `
SELECT
	r.id, r.title, r.description, r.prep_time, r.servings,
	r.is_published, r.cover_image, r.created_at, r.updated_at,
	n.id as nutrition_id, n.name as nutrition_name, n.unit as nutrition_unit, n.value as nutrition_value
FROM (
	SELECT id, title, description, prep_time, servings, is_published, cover_image, created_at, updated_at
	FROM recipes
	%s
	ORDER BY title
	%s
) r
LEFT JOIN recipe_nutritions n ON r.id = n.recipe_id
ORDER BY r.title, n.id
`

const countRecipesSql = "SELECT COUNT(*) FROM recipes"

func (a *Recipe) ListRecipes(ctx context.Context, filter models.ListRecipesFilter) (*pagination.PaginationResponse[models.Recipe], error) {
	params := []any{}
	countParams := []any{}

	filterSql := ""

	if filter.IsPublished != nil {
		filterSql = fmt.Sprintf("WHERE is_published = $%d", len(params)+1)
		params = append(params, *filter.IsPublished)
		countParams = append(countParams, *filter.IsPublished)
	}

	limitSql := fmt.Sprintf("LIMIT $%d OFFSET $%d", len(params)+1, len(params)+2)
	params = append(params, filter.Limit, (filter.Page-1)*filter.Limit)

	// Format the SQL with the filter and limit clauses in the subquery
	query := fmt.Sprintf(listRecipesSql, filterSql, limitSql)

	rows, err := a.db.Query(ctx, query, params...)
	if err != nil {
		return nil, fmt.Errorf("failed to read rows: %w", err)
	}
	defer rows.Close()

	recipesMap := make(map[string]*models.Recipe)

	for rows.Next() {
		var (
			id             string
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
			&id, &title, &description, &prepTime, &servings,
			&isPublished, &coverImage, &createdAt, &updatedAt,
			&nutritionID, &nutritionName, &nutritionUnit, &nutritionValue,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		recipe, exists := recipesMap[id]
		if !exists {
			recipe = &models.Recipe{
				ID:          id,
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
			recipesMap[id] = recipe
		}

		if nutritionID != nil && nutritionName != nil && nutritionUnit != nil && nutritionValue != nil {
			recipe.Nutritions = append(recipe.Nutritions, models.Nutrition{
				ID:       *nutritionID,
				RecipeID: id,
				Name:     *nutritionName,
				Unit:     *nutritionUnit,
				Value:    *nutritionValue,
			})
		}
	}

	recipes := make([]models.Recipe, 0, len(recipesMap))
	for _, recipe := range recipesMap {
		recipes = append(recipes, *recipe)
	}

	countFilterSql := ""
	if filter.IsPublished != nil {
		countFilterSql = " WHERE is_published = $1"
	}

	var count uint32
	err = a.db.QueryRow(ctx, countRecipesSql+countFilterSql, countParams...).Scan(&count)
	if err != nil {
		return nil, fmt.Errorf("failed to count rows: %w", err)
	}

	return pagination.New(recipes, count, filter.Page, filter.Limit), nil
}
