import type { RecipeStep } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export type UpdateRecipeStepInput = {
  recipeId: string;
  stepId: number;
  data: {
    description?: string;
    order?: number;
  };
};

export const updateRecipeStep = async (api: AuthApiClient, payload: UpdateRecipeStepInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/steps/${payload.stepId}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<RecipeStep>;
};

export const useRecipeStepUpdate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRecipeStepInput) => updateRecipeStep(api, payload),
    onSuccess: (data) => {
      queryClient.setQueryData<RecipeStep[]>(
        getRecipeStepsQueryOptions(api, data.recipeId).queryKey,
        (old) => old?.map((step) => (step.id === data.id ? data : step)),
      );
    },
  });
};
