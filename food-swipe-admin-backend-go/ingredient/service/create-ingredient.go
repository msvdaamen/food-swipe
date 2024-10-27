package service

import "food-swipe.app/ingredient/dto"

func (s *Service) CreateIngredient(payload *dto.CreateIngredientDto) (*Ingredient, error) {
	ingredient, err := s.storage.CreateIngredient(payload.Name)
	if err != nil {
		return nil, err
	}

	return storageIngredientToIngredient(ingredient), nil
}
