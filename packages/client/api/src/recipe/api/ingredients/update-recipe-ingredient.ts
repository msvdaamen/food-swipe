import type { RecipeIngredient } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export type UpdateRecipeIngredientInput = {
  recipeId: string;
  ingredientId: number;
  data: {
    amount?: number;
    measurementId?: number | null;
  };
};

export const updateRecipeIngredient = async (
  api: AuthApiClient,
  payload: UpdateRecipeIngredientInput,
) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/ingredients/${payload.ingredientId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload.data),
    },
  );
  return response.json() as Promise<RecipeIngredient>;
};

export const useRecipeIngredientUpdate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRecipeIngredientInput) => updateRecipeIngredient(api, payload),
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(api, ingredient.recipeId).queryKey,
        (old) => old?.map((i) => (i.ingredientId === ingredient.ingredientId ? ingredient : i)),
      );
    },
  });
};
