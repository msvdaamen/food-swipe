import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { objectToSearchParams } from "@/lib/api/search-params";
import { recipeKeys, type RecipeListFilter } from "../keys";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

export type GetRecipesInput = RecipeListFilter;

export const getRecipes = async (payload: GetRecipesInput = {}) => {
  const params = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/recipes?${params}`);
  const recipes = (await response.json()) as RecipeDto[];
  return recipes.map(mapRecipeDtoToModel);
};

export const getRecipesQueryOptions = (payload: GetRecipesInput = {}) =>
  queryOptions({
    queryKey: recipeKeys.list(payload),
    queryFn: () => getRecipes(payload),
  });

export const useRecipes = (payload?: GetRecipesInput) => {
  return useQuery(getRecipesQueryOptions(payload));
};
