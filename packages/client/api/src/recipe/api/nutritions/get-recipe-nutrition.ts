import type { RecipeNutrition } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { recipeKeys } from "../../keys";

export const getRecipeNutrition = async (api: AuthApiClient, recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/nutritions`);
  return response.json() as Promise<RecipeNutrition[]>;
};

export const getRecipeNutritionQueryOptions = (api: AuthApiClient, recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.nutrition(recipeId),
    queryFn: () => getRecipeNutrition(api, recipeId),
  });

export const useRecipeNutrition = (recipeId: string) => {
  const api = useApiClient();
  return useQuery(getRecipeNutritionQueryOptions(api, recipeId));
};
