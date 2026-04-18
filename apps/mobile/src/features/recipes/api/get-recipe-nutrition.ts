import type { RecipeNutrition } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { recipeKeys } from "../keys";

export const getRecipeNutrition = async (recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/nutritions`);
  return response.json() as Promise<RecipeNutrition[]>;
};

export const getRecipeNutritionQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.nutrition(recipeId),
    queryFn: () => getRecipeNutrition(recipeId),
  });

export const useRecipeNutrition = (recipeId: string) => {
  return useQuery(getRecipeNutritionQueryOptions(recipeId));
};
