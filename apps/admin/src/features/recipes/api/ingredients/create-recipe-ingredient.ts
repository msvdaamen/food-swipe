import type { RecipeIngredient } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRecipeIngredient,
  type CreateRecipeIngredientInput
} from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export { type CreateRecipeIngredientInput };

export const useRecipeIngredientCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRecipeIngredientInput) => createRecipeIngredient(api, payload),
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(ingredient.recipeId).queryKey,
        (old) => [...(old ?? []), ingredient]
      );
    }
  });
};
