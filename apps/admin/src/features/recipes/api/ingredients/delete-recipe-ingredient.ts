import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpApi } from "@/lib/api";
import { RecipeIngredient } from "../../types/recipe-ingredient.type";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export type DeleteRecipeIngredientInput = {
  recipeId: number;
  ingredientId: number;
}

export const deleteRecipeIngredient = (payload: DeleteRecipeIngredientInput) => {
  return httpApi.delete<RecipeIngredient>(`/v1/recipes/${payload.recipeId}/ingredients/${payload.ingredientId}`);
}

export const useRecipeIngredientDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecipeIngredient,
    onSuccess: (_, {recipeId, ingredientId}) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(recipeId).queryKey,
        (old) => old?.filter((i) => i.ingredientId !== ingredientId)
      );
    },
  });
}; 