import { queryOptions, useQuery } from "@tanstack/react-query";
import { objectToSearchParams } from "@/lib/utils";
import { api } from "@/lib/api";
import { Recipe } from "../types/recipe.type";

export type GetRecipesInput = {
    isPublished?: boolean;
}

export const getRecipes = (payload: GetRecipesInput = {}) => {
    const params = objectToSearchParams(payload);
    return api.get<Recipe[]>(`/v1/recipes?${params}`);
}

export const getRecipesQueryOptions = (payload: GetRecipesInput = {}) => {
    return queryOptions({
        queryKey: ["recipes", payload],
        queryFn: () => getRecipes(payload),
    });
}

export const useRecipes = (payload?: GetRecipesInput) => useQuery(getRecipesQueryOptions(payload))