import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRecipes, type GetRecipesInput } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";

export { type GetRecipesInput };

export const getRecipesQueryOptions = (payload: GetRecipesInput = {}) =>
  queryOptions({
    queryKey: ["recipes", payload] as const,
    queryFn: () => getRecipes(api, payload)
  });

export const getRecipeRootQueryKey = () => ["recipes"];

export const useRecipes = (payload?: GetRecipesInput) => useQuery(getRecipesQueryOptions(payload));
