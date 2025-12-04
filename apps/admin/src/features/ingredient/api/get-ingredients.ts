import { objectToSearchParams } from "@/lib/utils";
import { Ingredient } from "../types/ingredient.type";
import { PaginatedData } from "@/types/paginated-data";
import { api } from "@/lib/api";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

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
    queryKey: ["ingredients", payload],
    queryFn: () => getIngredients(payload),
    placeholderData: keepPreviousData,
  });

export const useIngredients = (payload: GetIngredientsInput) =>
  useQuery(getIngredientsQueryOptions(payload));
