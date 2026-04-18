import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { recipeKeys } from "./keys";
import { mapRecipeDtoToModel, type RecipeDto } from "./types";
import type { ApiQueryOptions } from "../../../lib/api-query";

export const getRecipe = async (recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}`);
  const recipe = (await response.json()) as RecipeDto;
  return mapRecipeDtoToModel(recipe);
};

export const getRecipeQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.detail(recipeId),
    queryFn: () => getRecipe(recipeId),
  });

export const useRecipe = (
  { recipeId }: { recipeId: string },
  query?: ApiQueryOptions,
) => {
  return useQuery({
    ...getRecipeQueryOptions(recipeId),
    ...query,
  });
};
