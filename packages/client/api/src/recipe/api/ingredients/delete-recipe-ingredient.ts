import type { RecipeIngredient } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export type DeleteRecipeIngredientInput = {
  recipeId: string;
  ingredientId: number;
};

export const deleteRecipeIngredient = async (
  api: AuthApiClient,
  payload: DeleteRecipeIngredientInput,
) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/ingredients/${payload.ingredientId}`,
    {
      method: "DELETE",
    },
  );
  return response.json() as Promise<RecipeIngredient>;
};

export const useRecipeIngredientDelete = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteRecipeIngredientInput) => deleteRecipeIngredient(api, payload),
    onSuccess: (_, { recipeId, ingredientId }) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(api, recipeId).queryKey,
        (old) => old?.filter((i) => i.ingredientId !== ingredientId),
      );
    },
  });
};
