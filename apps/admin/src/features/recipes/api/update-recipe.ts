import type { Recipe } from "@food-swipe/types";
import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { updateRecipe, type UpdateRecipeInput } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeQueryOptions } from "./get-recipe";
import { getRecipeRootQueryKey } from "./get-recipes";

export { type UpdateRecipeInput };

type UseUpdateRecipeOptions = Omit<
  UseMutationOptions<Recipe, Error, UpdateRecipeInput>,
  "mutationFn"
>;

export const useUpdateRecipe = (config: UseUpdateRecipeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config;

  return useMutation({
    mutationFn: (payload: UpdateRecipeInput) => updateRecipe(api, payload),
    ...restConfig,
    onSuccess: (...args) => {
      const [recipe] = args;
      queryClient.invalidateQueries({ queryKey: getRecipeRootQueryKey() });
      queryClient.setQueryData<Recipe>(getRecipeQueryOptions(recipe.id).queryKey, recipe);
      onSuccess?.(...args);
    }
  });
};
