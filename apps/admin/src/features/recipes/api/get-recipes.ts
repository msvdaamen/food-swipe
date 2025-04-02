import { queryOptions, useQuery } from "@tanstack/react-query";
import { LoadRecipesRequest } from "../requests/load-recipes.request";
import { objectToSearchParams } from "@/lib/utils";
import { httpApi } from "@/lib/api";
import { Recipe } from "../types/recipe.type";



export const getRecipes = (payload: LoadRecipesRequest = {}) => {
    const params = objectToSearchParams(payload);
    return httpApi.get<Recipe[]>(`/v1/recipes?${params}`);
}

export const getRecipesQueryOptions = (payload: LoadRecipesRequest = {}) => {
    return queryOptions({
        queryKey: ["recipes", payload],
        queryFn: () => getRecipes(payload),
    });
}

export const useRecipes = (payload?: LoadRecipesRequest) => useQuery(getRecipesQueryOptions(payload))