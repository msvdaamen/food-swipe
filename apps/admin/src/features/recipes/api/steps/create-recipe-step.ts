import type { RecipeStep } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipeStep, type CreateRecipeStepInput } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export { type CreateRecipeStepInput };

export const useRecipeStepCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRecipeStepInput) => createRecipeStep(api, payload),
    onSuccess: (step) => {
      queryClient.setQueryData<RecipeStep[]>(
        getRecipeStepsQueryOptions(step.recipeId).queryKey,
        (old) => [...(old ?? []), step]
      );
    }
  });
};
