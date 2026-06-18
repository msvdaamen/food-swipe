import type { RecipeNutrition } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateRecipeNutrition,
  type UpdateRecipeNutritionInput
} from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeNutritionQueryOptions } from "./get-recipe-nutrition";

export { type UpdateRecipeNutritionInput };

export const useRecipeNutritionUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRecipeNutritionInput) => updateRecipeNutrition(api, payload),
    onSuccess: (nutrition) => {
      queryClient.setQueryData<RecipeNutrition[]>(
        getRecipeNutritionQueryOptions(nutrition.recipeId).queryKey,
        (old) => old?.map((n) => (n.name === nutrition.name ? nutrition : n))
      );
    }
  });
};
