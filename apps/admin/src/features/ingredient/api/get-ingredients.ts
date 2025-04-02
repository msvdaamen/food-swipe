import { objectToSearchParams } from "@/lib/utils";
import { Ingredient } from "../types/ingredient.type";
import { PaginatedData } from "@/types/paginated-data";
import { httpApi } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type GetIngredientsInput = {
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page: number;
    amount: number;
}

export const getIngredients = (payload: GetIngredientsInput, signal?: AbortSignal) => {
    const params = objectToSearchParams(payload);

    return httpApi.get<PaginatedData<Ingredient>>(`/v1/ingredients?${params}`, {
        signal,
    });
}

export const getIngredientsQueryOptions = (payload: GetIngredientsInput) => queryOptions({
    queryKey: ["ingredients", payload],
    queryFn: ({signal}) => getIngredients(payload, signal),
})

export const useIngredients = (payload: GetIngredientsInput) => useQuery(getIngredientsQueryOptions(payload));