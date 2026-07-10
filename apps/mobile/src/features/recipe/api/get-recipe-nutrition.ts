import { api } from "@/lib/api";
import { getRecipeNutrition } from "@food-swipe/client-api";
import { queryOptions } from "@tanstack/react-query";

export const getRecipeNutritionQueryOptions = (
  recipeId: string,
) =>
  queryOptions({
    queryKey: ['recipes', recipeId, 'nutritions'],
    queryFn: () => getRecipeNutrition(api, recipeId),
  });
