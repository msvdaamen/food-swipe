package ingredient

import (
	v1 "github.com/food-swipe/gen/grpc/food-swipe/v1"
	"github.com/food-swipe/internal/recipe/core/models"
)

func modelIngredientToGrpcIngredient(ingredient models.Ingredient) *v1.Ingredient {
	return &v1.Ingredient{
		Id:   ingredient.ID,
		Name: ingredient.Name,
	}
}
