import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RecipeIngredient } from "../../types/recipe-ingredient.type";
import { api } from "@/lib/api";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export type CreateRecipeIngredientInput = {
  recipeId: number;
  data: {
    ingredientId: number;
    amount: number;
    measurementId: number | null;
  }
}

export const createRecipeIngredient = (payload: CreateRecipeIngredientInput) => {
  return api.post<RecipeIngredient>(`/v1/recipes/${payload.recipeId}/ingredients`, payload.data);
}

export const useRecipeIngredientCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecipeIngredient,
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(ingredient.recipeId).queryKey,
        (old) => [...(old || []), ingredient]
      );
    },
  });
}; 