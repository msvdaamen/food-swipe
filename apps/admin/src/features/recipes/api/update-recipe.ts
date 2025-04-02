import { httpApi } from "@/lib/api";
import { Recipe } from "../types/recipe.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "@/lib/react-query";
import { getRecipeQueryOptions } from "./get-recipe";
import { getRecipesQueryOptions } from "./get-recipes";

export type UpdateRecipeInput = {
  recipeId: number;
  data: {
    title?: string;
    description?: string;
    prepTime?: number;
    servings?: number;
    calories?: number;
    isPublished?: boolean;
  };
};

export const updateRecipe = (payload: UpdateRecipeInput) => {
  return httpApi.put<Recipe>(`/v1/recipes/${payload.recipeId}`, payload.data);
};

type UseUpdateRecipeOptions = MutationConfig<typeof updateRecipe>;

export const useUpdateRecipe = (config: UseUpdateRecipeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config || {};

  return useMutation({
    mutationFn: updateRecipe,
    ...restConfig,
    onSuccess: (...args) => {
      const [recipe] = args;
      queryClient.invalidateQueries(getRecipesQueryOptions());

      queryClient.setQueryData<Recipe>(
        getRecipeQueryOptions(recipe.id).queryKey,
        recipe
      );
      onSuccess?.(...args);
    },
  });
};
