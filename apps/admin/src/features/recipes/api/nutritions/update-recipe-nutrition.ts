import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RecipeNutrition } from "../../types/recipe-nutrition.type";
import { NutritionUnit } from "../../constants/nutritions";
import { getRecipeNutritionQueryOptions } from "./get-recipe-nutrition";

export type UpdateRecipeNutritionInput = {
  recipeId: string;
  name: string;
  data: {
    unit: NutritionUnit;
    value: number;
  };
};

export const updateRecipeNutrition = async (payload: UpdateRecipeNutritionInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/nutritions/${payload.name}`, {
    method: "PUT",
    body: JSON.stringify(payload.data)
  });
  return response.json() as Promise<RecipeNutrition>;
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
