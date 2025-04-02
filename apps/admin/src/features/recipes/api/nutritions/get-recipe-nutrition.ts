import { useQuery, queryOptions } from "@tanstack/react-query";
import { httpApi } from "@/lib/api";
import { RecipeNutrition } from "../../types/recipe-nutrition.type";

export const getRecipeNutrition = (recipeId: number) => {
  return httpApi.get<RecipeNutrition[]>(`/v1/recipes/${recipeId}/nutrition`);
}

export const getRecipeNutritionQueryOptions = (recipeId: number) => {
  return queryOptions({
    queryKey: ["recipes", recipeId, "nutrition"],
    queryFn: () => getRecipeNutrition(recipeId),
  });
}

export const useRecipeNutrition = (recipeId: number) => useQuery(getRecipeNutritionQueryOptions(recipeId))