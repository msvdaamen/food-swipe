package recipe

import (
	"bytes"
	"context"
	"fmt"

	"github.com/food-swipe/internal/pkg"
	filestorage "github.com/food-swipe/internal/pkg/file-storage"
	"github.com/food-swipe/internal/recipe/core/models"
	"github.com/google/uuid"
)

func (r *Recipe) UploadRecipeImage(ctx context.Context, id string, data []byte) (*models.Recipe, error) {
	// Get the existing recipe to check for old cover image
	existingRecipe, err := r.storage.GetRecipe(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get recipe: %w", err)
	}

	// Generate a unique key for the image
	imageKey := fmt.Sprintf("recipes/%s", uuid.New().String())

	// Upload the new image
	fileName, err := r.fileStorage.Upload(ctx, bytes.NewReader(data), filestorage.UploadOptions{
		IsPublic: pkg.Bool(true),
		Key:      &imageKey,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to upload image: %w", err)
	}

	// Update the recipe with the new cover image
	updatedRecipe, err := r.storage.UpdateRecipe(ctx, id, models.UpdateRecipeInput{
		CoverImage: fileName,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to update recipe with cover image: %w", err)
	}

	// Delete the old image if it exists
	if existingRecipe.CoverImage != nil && *existingRecipe.CoverImage != "" {
		if err := r.fileStorage.Delete(ctx, *existingRecipe.CoverImage, filestorage.DeleteOptions{
			IsPublic: pkg.Bool(true),
		}); err != nil {
			// Log the error but don't fail the operation
			// The new image has already been uploaded and the recipe updated
			fmt.Printf("warning: failed to delete old cover image: %v\n", err)
		}
	}

	return updatedRecipe, nil
}
