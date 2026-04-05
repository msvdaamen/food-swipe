import type { RecipeStep } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../../client";
import { useApiClient } from "../../../context";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";

export type CreateRecipeStepInput = {
  recipeId: string;
  data: {
    description: string;
    order: number;
  };
};

export const createRecipeStep = async (api: AuthApiClient, payload: CreateRecipeStepInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/steps`, {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<RecipeStep>;
};

export const useRecipeStepCreate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRecipeStepInput) => createRecipeStep(api, payload),
    onSuccess: (step) => {
      queryClient.setQueryData<RecipeStep[]>(
        getRecipeStepsQueryOptions(api, step.recipeId).queryKey,
        (old) => [...(old ?? []), step],
      );
    },
  });
};
