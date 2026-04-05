import type { Ingredient, PaginatedData } from "@food-swipe/types";
import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { objectToSearchParams } from "../../internal/search-params";
import { ingredientKeys } from "../keys";

export type GetIngredientsInput = {
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page: number;
  amount: number;
};

export const getIngredients = async (api: AuthApiClient, payload: GetIngredientsInput) => {
  const params = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/ingredients?${params}`);
  return response.json() as Promise<PaginatedData<Ingredient>>;
};

export const getIngredientsQueryOptions = (api: AuthApiClient, payload: GetIngredientsInput) =>
  queryOptions({
    queryKey: ingredientKeys.list(payload),
    queryFn: () => getIngredients(api, payload),
    placeholderData: keepPreviousData,
  });

export const useIngredients = (payload: GetIngredientsInput) => {
  const api = useApiClient();
  return useQuery(getIngredientsQueryOptions(api, payload));
};
