import { api } from "@/lib/api";
import { Recipe } from "../types/recipe.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "@/lib/react-query";
import { getRecipeQueryOptions } from "./get-recipe";
import { getRecipesQueryOptions } from "./get-recipes";

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
    body: JSON.stringify(payload.data)
  });
  return response.json() as Promise<Recipe>;
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
