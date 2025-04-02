import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpApi } from "@/lib/api";
import { RecipeNutrition } from "../../types/recipe-nutrition.type";
import { NutritionUnit } from "../../constants/nutritions";
import { getRecipeNutritionQueryOptions } from "./get-recipe-nutrition";

export type UpdateRecipeNutritionInput = {
  recipeId: number;
  name: string;
  data: {
    unit: NutritionUnit;
    value: number;
  };
};

export const updateRecipeNutrition = (payload: UpdateRecipeNutritionInput) => {
  return httpApi.put<RecipeNutrition>(
    `/v1/recipes/${payload.recipeId}/nutritions/${payload.name}`,
    payload.data
  );
};

export const useRecipeNutritionUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRecipeNutrition,
    onSuccess: (nutrition) => {
      queryClient.setQueryData<RecipeNutrition[]>(
        getRecipeNutritionQueryOptions(nutrition.recipeId).queryKey,
        (old) => old?.map((n) => (n.name === nutrition.name ? nutrition : n))
      );
    },
  });
};
