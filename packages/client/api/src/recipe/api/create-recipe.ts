import type { Recipe } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { getRecipesQueryOptions } from "./get-recipes";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

type CreateRecipeInput = {
  title: string;
};

export const createRecipe = async (api: AuthApiClient, payload: CreateRecipeInput) => {
  const response = await api.fetch("/v1/recipes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const recipe = (await response.json()) as RecipeDto;
  return mapRecipeDtoToModel(recipe);
};

export const useCreateRecipe = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecipeInput) => createRecipe(api, payload),
    onSuccess: (recipe) => {
      queryClient.setQueryData<Recipe[]>(getRecipesQueryOptions(api, {}).queryKey, (old) => [
        recipe,
        ...(old ?? []),
      ]);
    },
  });
};
