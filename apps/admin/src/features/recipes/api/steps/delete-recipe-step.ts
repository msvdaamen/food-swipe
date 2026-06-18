import type { RecipeStep } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecipeStep, type DeleteRecipeStepInput } from "@food-swipe/client-api/recipe";
import { api } from "@/lib/api";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export { type DeleteRecipeStepInput };

export const useRecipeStepDelete = (recipeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteRecipeStepInput) => deleteRecipeStep(api, payload),
    onSuccess: (_, { stepId }) => {
      const key = getRecipeStepsQueryOptions(recipeId).queryKey;
      queryClient.setQueryData<RecipeStep[]>(key, (old) =>
        old?.filter((step) => step.id !== stepId)
      );
      queryClient.invalidateQueries({ queryKey: key });
    }
  });
};
