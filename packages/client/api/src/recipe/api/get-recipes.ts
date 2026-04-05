import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { objectToSearchParams } from "../../internal/search-params";
import { recipeKeys, type RecipeListFilter } from "../keys";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

export type GetRecipesInput = RecipeListFilter;

export const getRecipes = async (api: AuthApiClient, payload: GetRecipesInput = {}) => {
  const params = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/recipes?${params}`);
  const recipes = (await response.json()) as RecipeDto[];
  return recipes.map(mapRecipeDtoToModel);
};

export const getRecipesQueryOptions = (api: AuthApiClient, payload: GetRecipesInput = {}) =>
  queryOptions({
    queryKey: recipeKeys.list(payload),
    queryFn: () => getRecipes(api, payload),
  });

export const useRecipes = (payload?: GetRecipesInput) => {
  const api = useApiClient();
  return useQuery(getRecipesQueryOptions(api, payload));
};
