import type { RecipeIngredient } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { recipeKeys } from "../../keys";

export const getRecipeIngredients = async (api: AuthApiClient, recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/ingredients`);
  return response.json() as Promise<RecipeIngredient[]>;
};

export const getRecipeIngredientsQueryOptions = (api: AuthApiClient, recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.ingredients(recipeId),
    queryFn: () => getRecipeIngredients(api, recipeId),
  });

export const useRecipeIngredients = (recipeId: string) => {
  const api = useApiClient();
  return useQuery(getRecipeIngredientsQueryOptions(api, recipeId));
};
