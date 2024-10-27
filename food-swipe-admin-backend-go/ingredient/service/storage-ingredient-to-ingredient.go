package service

import "food-swipe.app/ingredient/storage"

func storageIngredientToIngredient(payload *storage.Ingredient) *Ingredient {
	return &Ingredient{
		Id:   payload.Id,
		Name: payload.Name,
	}
}
