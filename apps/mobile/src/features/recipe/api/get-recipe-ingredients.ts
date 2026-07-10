import { api } from "@/lib/api";
import { getRecipeIngredients } from "@food-swipe/client-api";
import { queryOptions } from "@tanstack/react-query";

export const getRecipeIngredientsQueryOptions = (
  recipeId: string,
) =>
  queryOptions({
    queryKey: ['recipes', recipeId, 'ingredients'],
    queryFn: () => getRecipeIngredients(api, recipeId),
  });
