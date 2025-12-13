import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RecipeIngredient } from "../../types/recipe-ingredient.type";
import { api } from "@/lib/api";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export type CreateRecipeIngredientInput = {
  recipeId: string;
  data: {
    ingredientId: number;
    amount: number;
    measurementId: number | null;
  }
}

export const createRecipeIngredient = async (payload: CreateRecipeIngredientInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/ingredients`, {
    method: "POST",
    body: JSON.stringify(payload.data)
  });
  return response.json() as Promise<RecipeIngredient>;
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
