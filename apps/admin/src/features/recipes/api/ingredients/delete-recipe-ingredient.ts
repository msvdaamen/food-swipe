import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RecipeIngredient } from "../../types/recipe-ingredient.type";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export type DeleteRecipeIngredientInput = {
  recipeId: string;
  ingredientId: number;
}

export const deleteRecipeIngredient = async (payload: DeleteRecipeIngredientInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/ingredients/${payload.ingredientId}`, {
    method: "DELETE"
  });
  return response.json() as Promise<RecipeIngredient>;
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
