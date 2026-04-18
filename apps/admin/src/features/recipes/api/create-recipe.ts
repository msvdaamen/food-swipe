import type { Recipe } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getRecipesQueryOptions } from "./get-recipes";
import { mapRecipeDtoToModel, type RecipeDto } from "./types";

type CreateRecipeInput = {
  title: string;
};

export const createRecipe = async (payload: CreateRecipeInput) => {
  const response = await api.fetch("/v1/recipes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const recipe = (await response.json()) as RecipeDto;
  return mapRecipeDtoToModel(recipe);
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecipe,
    onSuccess: (recipe) => {
      queryClient.setQueryData<Recipe[]>(getRecipesQueryOptions({}).queryKey, (old) => [
        recipe,
        ...(old ?? []),
      ]);
    },
  });
};
