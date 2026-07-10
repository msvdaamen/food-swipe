import { api } from "@/lib/api";
import { getRecipe } from "@food-swipe/client-api";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getRecipeQueryOptions = (recipeId: string) =>
  queryOptions({
    queryKey: ['recipes', recipeId],
    queryFn: () => getRecipe(api, recipeId),
  });

export const useRecipe = (
  { recipeId }: { recipeId: string },
  query?: Omit<ReturnType<typeof getRecipeQueryOptions>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    ...getRecipeQueryOptions(recipeId),
    ...query,
  });
};
