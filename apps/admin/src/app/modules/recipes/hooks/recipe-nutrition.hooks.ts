import { useMutation, useQuery } from "@tanstack/react-query";
import { recipeApi } from "../recipe.api";
import { UpdateRecipeNutritionRequest } from "../requests/update-recipe-nutrition.request";

export const useRecipeNutrition = (recipeId: number) => {
  return useQuery({
    queryKey: ["recipes", recipeId, "nutrition"],
    queryFn: () => recipeApi.getNutritions(recipeId),
  });
};

export const useRecipeNutritionUpdate = (recipeId: number) => {
  return useMutation({
    mutationFn: (nutrition: UpdateRecipeNutritionRequest & { name: string }) =>
      recipeApi.updateNutrition(recipeId, nutrition.name, {
        value: nutrition.value,
        unit: nutrition.unit,
      }),
  });
};
