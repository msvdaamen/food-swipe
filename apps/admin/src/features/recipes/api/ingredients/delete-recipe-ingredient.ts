import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteRecipeIngredient,
  type DeleteRecipeIngredientInput
} from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export { type DeleteRecipeIngredientInput };

export const useRecipeIngredientDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteRecipeIngredientInput) => deleteRecipeIngredient(api, payload),
    onSuccess: (_, { recipeId, ingredientId }) => {
      queryClient.setQueryData(getRecipeIngredientsQueryOptions(recipeId).queryKey, (old) =>
        old?.filter((i) => i.ingredientId !== ingredientId)
      );
    }
  });
};
