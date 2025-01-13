package service

import (
	"fmt"
	"food-swipe.app/common"
	"food-swipe.app/ingredient/dto"
	"food-swipe.app/ingredient/storage"
)

func (s *Service) GetAll(payload dto.GetAll) (*common.PaginatedResult[*Ingredient], error) {
	result, err := s.storage.GetAll(storage.GetAllOptions(payload))
	if err != nil {
		return nil, fmt.Errorf("could not get all ingredients: %w", err)
	}
	ingredients := make([]*Ingredient, len(result.Data))
	for i, ingredient := range result.Data {
		ingredients[i] = storageIngredientToIngredient(&ingredient)
	}
	return &common.PaginatedResult[*Ingredient]{
		Data:       ingredients,
		Pagination: result.Pagination,
	}, nil
}
