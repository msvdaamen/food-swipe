import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { getIngredients, type GetIngredientsInput } from "@food-swipe/client-api/ingredient";
import { api } from "@/lib/api";

export { type GetIngredientsInput };

export const getIngredientsQueryOptions = (payload: GetIngredientsInput) =>
  queryOptions({
    queryKey: ["ingredients", payload],
    queryFn: () => getIngredients(api, payload),
    placeholderData: keepPreviousData
  });

export const useIngredients = (payload: GetIngredientsInput) =>
  useQuery(getIngredientsQueryOptions(payload));
