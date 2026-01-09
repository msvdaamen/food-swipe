package recipe

import (
	"context"
	"fmt"
	"log"

	"github.com/food-swipe/internal/recipe/core/models"
	"github.com/jackc/pgx/v5"
)

const getRecipeBookByUserSql = `
SELECT id FROM recipe_books WHERE user_id = $1 LIMIT 1
`

const createRecipeBookSql = `
INSERT INTO recipe_books (user_id, name)
VALUES ($1, $2)
RETURNING id
`

const addRecipeToBookSql = `
INSERT INTO recipes_to_recipe_books (recipe_book_id, recipe_id)
VALUES ($1, $2)
ON CONFLICT (recipe_book_id, recipe_id) DO NOTHING
`

const removeRecipeFromBookSql = `
DELETE FROM recipes_to_recipe_books
WHERE recipe_book_id = $1 AND recipe_id = $2
`

func (a *Recipe) LikeRecipe(ctx context.Context, userID string, recipeID string, like bool) (*models.Recipe, error) {
	tx, err := a.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() {
		err = tx.Rollback(ctx)
		if err != nil {
			log.Printf("failed to rollback transaction: %v", err)
		}
	}()

	// Get or create recipe book for user
	var recipeBookID int
	err = tx.QueryRow(ctx, getRecipeBookByUserSql, userID).Scan(&recipeBookID)
	if err != nil {
		if err == pgx.ErrNoRows {
			// Create a new recipe book for the user
			err = tx.QueryRow(ctx, createRecipeBookSql, userID, "My Recipes").Scan(&recipeBookID)
			if err != nil {
				return nil, fmt.Errorf("failed to create recipe book: %w", err)
			}
		} else {
			return nil, fmt.Errorf("failed to get recipe book: %w", err)
		}
	}

	if like {
		// Add recipe to book
		_, err = tx.Exec(ctx, addRecipeToBookSql, recipeBookID, recipeID)
		if err != nil {
			return nil, fmt.Errorf("failed to add recipe to book: %w", err)
		}
	} else {
		// Remove recipe from book
		_, err = tx.Exec(ctx, removeRecipeFromBookSql, recipeBookID, recipeID)
		if err != nil {
			return nil, fmt.Errorf("failed to remove recipe from book: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	recipe, err := a.GetRecipe(ctx, recipeID)
	if err != nil {
		return nil, fmt.Errorf("failed to get recipe after like operation: %w", err)
	}
	return recipe, nil
}
