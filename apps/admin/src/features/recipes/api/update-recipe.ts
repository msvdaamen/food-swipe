import type { Recipe } from "@food-swipe/types";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { recipeKeys } from "./keys";
import { getRecipeQueryOptions } from "./get-recipe";
import { mapRecipeDtoToModel, type RecipeDto } from "./types";

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

export const updateRecipe = async (payload: UpdateRecipeInput) => {
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
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config;

  return useMutation({
    mutationFn: updateRecipe,
    ...restConfig,
    onSuccess: (...args) => {
      const [recipe] = args;
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      queryClient.setQueryData<Recipe>(getRecipeQueryOptions(recipe.id).queryKey, recipe);
      onSuccess?.(...args);
    },
  });
};
