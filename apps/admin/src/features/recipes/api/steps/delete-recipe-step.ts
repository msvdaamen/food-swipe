import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RecipeStep } from "../../types/recipe-step.type";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export type DeleteRecipeStepInput = {
  recipeId: number;
  stepId: number;
};

export const deleteRecipeStep = (payload: DeleteRecipeStepInput) => {
  return api.delete<void>(
    `/v1/recipes/${payload.recipeId}/steps/${payload.stepId}`
  );
};

export const useRecipeStepDelete = (recipeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecipeStep,
    onSuccess: (_, { stepId }) => {
      const key = getRecipeStepsQueryOptions(recipeId).queryKey;
      queryClient.setQueryData<RecipeStep[]>(key, (old) =>
        old?.filter((step) => step.id !== stepId)
      );
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
