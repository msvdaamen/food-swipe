import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRecipeNutrition } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeQueryOptions } from "../get-recipe";

export const getRecipeNutritionQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: [...getRecipeQueryOptions(recipeId).queryKey, "nutrition"] as const,
    queryFn: () => getRecipeNutrition(api, recipeId)
  });

export const useRecipeNutrition = (recipeId: string) => {
  return useQuery(getRecipeNutritionQueryOptions(recipeId));
};
