import type { RecipeStep } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { recipeKeys } from "../keys";

export const getRecipeSteps = async (recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/steps`);
  return response.json() as Promise<RecipeStep[]>;
};

export const getRecipeStepsQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.steps(recipeId),
    queryFn: () => getRecipeSteps(recipeId),
  });

export const useRecipeSteps = (recipeId: string) => {
  return useQuery(getRecipeStepsQueryOptions(recipeId));
};
