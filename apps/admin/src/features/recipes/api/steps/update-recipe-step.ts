import type { RecipeStep } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRecipeStep, type UpdateRecipeStepInput } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export { type UpdateRecipeStepInput };

export const useRecipeStepUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRecipeStepInput) => updateRecipeStep(api, payload),
    onSuccess: (data) => {
      queryClient.setQueryData<RecipeStep[]>(
        getRecipeStepsQueryOptions(data.recipeId).queryKey,
        (old) => old?.map((step) => (step.id === data.id ? data : step))
      );
    }
  });
};
