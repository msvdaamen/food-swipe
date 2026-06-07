import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRecipe } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";

export const getRecipeQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: ["recipes", recipeId] as const,
    queryFn: () => getRecipe(api, recipeId)
  });

export const useRecipe = (
  { recipeId }: { recipeId: string },
  query?: Omit<ReturnType<typeof getRecipeQueryOptions>, "queryKey" | "queryFn">
) => {
  return useQuery({
    ...getRecipeQueryOptions(recipeId),
    ...query
  });
};
