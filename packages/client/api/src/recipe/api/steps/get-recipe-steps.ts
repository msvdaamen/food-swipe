import type { RecipeStep } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { recipeKeys } from "../../keys";

export const getRecipeSteps = async (api: AuthApiClient, recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/steps`);
  return response.json() as Promise<RecipeStep[]>;
};

export const getRecipeStepsQueryOptions = (api: AuthApiClient, recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.steps(recipeId),
    queryFn: () => getRecipeSteps(api, recipeId),
  });

export const useRecipeSteps = (recipeId: string) => {
  const api = useApiClient();
  return useQuery(getRecipeStepsQueryOptions(api, recipeId));
};
