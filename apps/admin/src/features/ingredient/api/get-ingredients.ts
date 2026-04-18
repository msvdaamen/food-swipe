import type { Ingredient, PaginatedData } from "@food-swipe/types";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { objectToSearchParams } from "@/lib/utils";
import { ingredientKeys } from "./keys";

export type GetIngredientsInput = {
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page: number;
  amount: number;
};

export const getIngredients = async (payload: GetIngredientsInput) => {
  const params = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/ingredients?${params}`);
  return response.json() as Promise<PaginatedData<Ingredient>>;
};

export const getIngredientsQueryOptions = (payload: GetIngredientsInput) =>
  queryOptions({
    queryKey: ingredientKeys.list(payload),
    queryFn: () => getIngredients(payload),
    placeholderData: keepPreviousData,
  });

export const useIngredients = (payload: GetIngredientsInput) => {
  return useQuery(getIngredientsQueryOptions(payload));
};
