import type { RecipeStep } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export type DeleteRecipeStepInput = {
  recipeId: string;
  stepId: number;
};

export const deleteRecipeStep = async (api: AuthApiClient, payload: DeleteRecipeStepInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/steps/${payload.stepId}`, {
    method: "DELETE",
  });
  return response.json() as Promise<void>;
};

export const useRecipeStepDelete = (recipeId: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteRecipeStepInput) => deleteRecipeStep(api, payload),
    onSuccess: (_, { stepId }) => {
      const key = getRecipeStepsQueryOptions(api, recipeId).queryKey;
      queryClient.setQueryData<RecipeStep[]>(key, (old) =>
        old?.filter((step) => step.id !== stepId),
      );
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
