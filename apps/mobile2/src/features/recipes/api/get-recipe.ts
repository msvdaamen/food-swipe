import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { recipeKeys } from "../keys";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

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

export const useRecipe = (recipeId: string) => {
  return useQuery(getRecipeQueryOptions(recipeId));
};
