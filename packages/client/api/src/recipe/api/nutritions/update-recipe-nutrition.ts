import type { Nutrition, NutritionUnit, RecipeNutrition } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { getRecipeNutritionQueryOptions } from "./get-recipe-nutrition";

export type UpdateRecipeNutritionInput = {
  recipeId: string;
  name: Nutrition;
  data: {
    unit: NutritionUnit;
    value: number;
  };
};

export const updateRecipeNutrition = async (
  api: AuthApiClient,
  payload: UpdateRecipeNutritionInput,
) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/nutritions/${payload.name}`,
    {
      method: "PUT",
      body: JSON.stringify(payload.data),
    },
  );
  return response.json() as Promise<RecipeNutrition>;
};

export const useRecipeNutritionUpdate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRecipeNutritionInput) => updateRecipeNutrition(api, payload),
    onSuccess: (nutrition) => {
      queryClient.setQueryData<RecipeNutrition[]>(
        getRecipeNutritionQueryOptions(api, nutrition.recipeId).queryKey,
        (old) => old?.map((n) => (n.name === nutrition.name ? nutrition : n)),
      );
    },
  });
};
