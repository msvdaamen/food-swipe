import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRecipeSteps } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeQueryOptions } from "../get-recipe";

export const getRecipeStepsQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: [...getRecipeQueryOptions(recipeId).queryKey, "steps"] as const,
    queryFn: () => getRecipeSteps(api, recipeId)
  });

export const useRecipeSteps = (recipeId: string) => {
  return useQuery(getRecipeStepsQueryOptions(recipeId));
};
