import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpApi } from "@/lib/api";
import { RecipeStep } from "../../types/recipe-step.type";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export type UpdateRecipeStepInput = {
  recipeId: number;
  stepId: number;
  data: {
    description?: string;
    order?: number;
  };
}

export const updateRecipeStep = (payload: UpdateRecipeStepInput) => {
  return httpApi.put<RecipeStep>(`/v1/recipes/${payload.recipeId}/steps/${payload.stepId}`, payload.data);
}

export const useRecipeStepUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRecipeStep,
    onSuccess: (data) => {
      queryClient.setQueryData<RecipeStep[]>(getRecipeStepsQueryOptions(data.recipeId).queryKey, (old) =>
        old?.map((step) => (step.id === data.id ? data : step))
      );
    },
  });
}; 