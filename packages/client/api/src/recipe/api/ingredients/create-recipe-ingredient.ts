import type { RecipeIngredient } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export type CreateRecipeIngredientInput = {
  recipeId: string;
  data: {
    ingredientId: number;
    amount: number;
    measurementId: number | null;
  };
};

export const createRecipeIngredient = async (
  api: AuthApiClient,
  payload: CreateRecipeIngredientInput,
) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/ingredients`, {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<RecipeIngredient>;
};

export const useRecipeIngredientCreate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRecipeIngredientInput) => createRecipeIngredient(api, payload),
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(api, ingredient.recipeId).queryKey,
        (old) => [...(old ?? []), ingredient],
      );
    },
  });
};
