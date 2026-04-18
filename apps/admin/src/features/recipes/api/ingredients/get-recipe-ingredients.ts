import type { RecipeIngredient } from "@food-swipe/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { recipeKeys } from "../keys";

export const getRecipeIngredients = async (recipeId: string) => {
  const response = await api.fetch(`/v1/recipes/${recipeId}/ingredients`);
  return response.json() as Promise<RecipeIngredient[]>;
};

export const getRecipeIngredientsQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.ingredients(recipeId),
    queryFn: () => getRecipeIngredients(recipeId),
  });

export const useRecipeIngredients = (recipeId: string) => {
  return useQuery(getRecipeIngredientsQueryOptions(recipeId));
};
