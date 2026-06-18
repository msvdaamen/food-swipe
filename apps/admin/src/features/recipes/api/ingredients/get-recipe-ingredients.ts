import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRecipeIngredients } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeQueryOptions } from "../get-recipe";

export const getRecipeIngredientsQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: [...getRecipeQueryOptions(recipeId).queryKey, "ingredients"] as const,
    queryFn: () => getRecipeIngredients(api, recipeId)
  });

export const useRecipeIngredients = (recipeId: string) => {
  return useQuery(getRecipeIngredientsQueryOptions(recipeId));
};
