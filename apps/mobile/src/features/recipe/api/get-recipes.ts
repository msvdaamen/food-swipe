import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";
import { getRecipes, GetRecipesInput } from "@food-swipe/client-api";


export const getRecipesQueryOptions = (
  payload: GetRecipesInput = {},
) =>
  queryOptions({
    queryKey: ['recipes', payload],
    queryFn: () => getRecipes(api, payload),
  });
