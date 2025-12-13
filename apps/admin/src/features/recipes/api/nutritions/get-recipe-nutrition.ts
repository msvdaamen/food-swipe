import { useQuery, queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RecipeNutrition } from "../../types/recipe-nutrition.type";

export const getRecipeNutrition = async (recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/nutritions`);
  return response.json() as Promise<RecipeNutrition[]>;
};

export const getRecipeNutritionQueryOptions = (recipeId: string) => {
  return queryOptions({
    queryKey: ["recipes", recipeId, "nutrition"],
    queryFn: () => getRecipeNutrition(recipeId),
  });
};

export const useRecipeNutrition = (recipeId: string) =>
  useQuery(getRecipeNutritionQueryOptions(recipeId));
