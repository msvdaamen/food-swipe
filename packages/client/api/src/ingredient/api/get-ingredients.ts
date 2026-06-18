import type { Ingredient, PaginatedData } from "@food-swipe/types";
import type { HttpClient } from "../../client";
import { objectToSearchParams } from "../../internal/search-params";

export type GetIngredientsInput = {
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page: number;
  amount: number;
};

export const getIngredients = async (api: HttpClient, payload: GetIngredientsInput) => {
  const params = objectToSearchParams(payload);
  const response = await api.fetch(`/v1/ingredients?${params}`);
  return response.json() as Promise<PaginatedData<Ingredient>>;
};
