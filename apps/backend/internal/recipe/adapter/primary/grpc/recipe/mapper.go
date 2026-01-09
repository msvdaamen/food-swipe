package recipe

import (
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func toProtoRecipe(recipe *models.Recipe) *v1.Recipe {
	nutritions := make([]*v1.Nutrition, len(recipe.Nutritions))
	for i, n := range recipe.Nutritions {
		nutritions[i] = toProtoNutrition(&n)
	}

	return &v1.Recipe{
		Id:          recipe.ID,
		Title:       recipe.Title,
		Description: recipe.Description,
		PrepTime:    recipe.PrepTime,
		Servings:    recipe.Servings,
		IsPublished: recipe.IsPublished,
		CoverImage:  recipe.CoverImage,
		CreatedAt:   recipe.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:   recipe.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		Nutritions:  nutritions,
	}
}

func toProtoRecipeStep(step *models.RecipeStep) *v1.RecipeStep {
	return &v1.RecipeStep{
		Id:          step.ID,
		RecipeId:    step.RecipeID,
		StepNumber:  step.StepNumber,
		Description: step.Description,
	}
}

func toProtoRecipeIngredient(ingredient *models.RecipeIngredient) *v1.RecipeIngredient {
	result := &v1.RecipeIngredient{
		RecipeId:      ingredient.RecipeID,
		IngredientId:  ingredient.IngredientID,
		MeasurementId: ingredient.MeasurementID,
		Amount:        ingredient.Amount,
		Ingredient:    ingredient.Ingredient,
		Measurement:   ingredient.Measurement,
	}

	return result
}

func toProtoNutrition(nutrition *models.Nutrition) *v1.Nutrition {
	return &v1.Nutrition{
		Id:    nutrition.ID,
		Name:  nutrition.Name,
		Unit:  nutrition.Unit,
		Value: nutrition.Value,
	}
}

func toListRecipesFilter(req *v1.ListRecipesRequest) models.ListRecipesFilter {
	return models.ListRecipesFilter{
		Page:        req.Page,
		Limit:       req.Limit,
		IsPublished: req.IsPublished,
	}
}

func toCreateRecipeInput(req *v1.CreateRecipeRequest) models.CreateRecipeInput {
	return models.CreateRecipeInput{
		Title:       req.Title,
		Description: req.Description,
		PrepTime:    req.PrepTime,
		Servings:    req.Servings,
		IsPublished: req.IsPublished,
	}
}

func toUpdateRecipeInput(req *v1.UpdateRecipeRequest) models.UpdateRecipeInput {
	return models.UpdateRecipeInput{
		Title:       req.Title,
		Description: req.Description,
		PrepTime:    req.PrepTime,
		Servings:    req.Servings,
		IsPublished: req.IsPublished,
	}
}

func toCreateRecipeStepInput(req *v1.CreateRecipeStepRequest) models.CreateRecipeStepInput {
	return models.CreateRecipeStepInput{
		Order:       req.Order,
		Description: req.Description,
	}
}

func toUpdateRecipeStepInput(req *v1.UpdateRecipeStepRequest) models.UpdateRecipeStepInput {
	return models.UpdateRecipeStepInput{
		Description: req.Description,
	}
}

func toReorderRecipeStepInput(req *v1.ReorderRecipeStepRequest) models.ReorderRecipeStepInput {
	return models.ReorderRecipeStepInput{
		OrderFrom: req.OrderFrom,
		OrderTo:   req.OrderTo,
	}
}

func toCreateRecipeIngredientInput(req *v1.CreateRecipeIngredientRequest) models.CreateRecipeIngredientInput {
	return models.CreateRecipeIngredientInput{
		IngredientID:  req.IngredientId,
		MeasurementID: req.MeasurementId,
		Amount:        req.Amount,
	}
}

func toUpdateRecipeIngredientInput(req *v1.UpdateRecipeIngredientRequest) models.UpdateRecipeIngredientInput {
	return models.UpdateRecipeIngredientInput{
		MeasurementID: req.MeasurementId,
		Amount:        req.Amount,
	}
}

func toUpdateNutritionInput(req *v1.UpdateRecipeNutritionRequest) models.UpdateNutritionInput {
	return models.UpdateNutritionInput{
		Name:  req.Name,
		Unit:  req.Unit,
		Value: req.Value,
	}
}
