import type { RecipeIngredient } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateRecipeIngredient,
  type UpdateRecipeIngredientInput
} from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export { type UpdateRecipeIngredientInput };

export const useRecipeIngredientUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRecipeIngredientInput) => updateRecipeIngredient(api, payload),
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(ingredient.recipeId).queryKey,
        (old) => old?.map((i) => (i.ingredientId === ingredient.ingredientId ? ingredient : i))
      );
    }
  });
};
