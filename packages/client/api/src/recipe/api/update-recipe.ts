import type { Recipe } from "@food-swipe/types";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { recipeKeys } from "../keys";
import { getRecipeQueryOptions } from "./get-recipe";
import { mapRecipeDtoToModel, type RecipeDto } from "../types";

export type UpdateRecipeInput = {
  recipeId: string;
  data: {
    title?: string;
    description?: string;
    prepTime?: number;
    servings?: number;
    calories?: number;
    isPublished?: boolean;
  };
};

export const updateRecipe = async (api: AuthApiClient, payload: UpdateRecipeInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
  const recipe = (await response.json()) as RecipeDto;
  return mapRecipeDtoToModel(recipe);
};

type UseUpdateRecipeOptions = Omit<
  UseMutationOptions<Recipe, Error, UpdateRecipeInput>,
  "mutationFn"
>;

export const useUpdateRecipe = (config: UseUpdateRecipeOptions = {}) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config;

  return useMutation({
    mutationFn: (payload: UpdateRecipeInput) => updateRecipe(api, payload),
    ...restConfig,
    onSuccess: (...args) => {
      const [recipe] = args;
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      queryClient.setQueryData<Recipe>(getRecipeQueryOptions(api, recipe.id).queryKey, recipe);
      onSuccess?.(...args);
    },
  });
};
