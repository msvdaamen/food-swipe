import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { recipeKeys } from "../keys";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";
import type { ApiQueryOptions } from "../../types";

export const getRecipe = async (api: AuthApiClient, recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}`);
  const recipe = (await response.json()) as RecipeDto;
  return mapRecipeDtoToModel(recipe);
};

export const getRecipeQueryOptions = (api: AuthApiClient, recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.detail(recipeId),
    queryFn: () => getRecipe(api, recipeId),
  });

export const useRecipe = (
  { recipeId }: { recipeId: string },
  query?: ApiQueryOptions,
) => {
  const api = useApiClient();
  return useQuery({
    ...getRecipeQueryOptions(api, recipeId),
    ...query,
  });
};
