import type { RecipeStep } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export type UpdateRecipeStepInput = {
  recipeId: string;
  stepId: number;
  data: {
    description?: string;
    order?: number;
  };
};

export const updateRecipeStep = async (payload: UpdateRecipeStepInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/steps/${payload.stepId}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<RecipeStep>;
};

export const useRecipeStepUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRecipeStep,
    onSuccess: (data) => {
      queryClient.setQueryData<RecipeStep[]>(
        getRecipeStepsQueryOptions(data.recipeId).queryKey,
        (old) => old?.map((step) => (step.id === data.id ? data : step)),
      );
    },
  });
};
