import { api } from "@/lib/api";
import { getRecipeSteps } from "@food-swipe/client-api";
import { queryOptions } from "@tanstack/react-query";

export const getRecipeStepsQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: ['recipes', recipeId, 'steps'],
    queryFn: () => getRecipeSteps(api, recipeId),
  });
