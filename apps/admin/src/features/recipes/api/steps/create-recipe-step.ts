import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getRecipeStepsQueryOptions } from "./get-recipe-steps";
import { RecipeStep } from "../../types/recipe-step.type";

export type CreateRecipeStepInput = {
  recipeId: number;
  data: {
    description: string;
    order: number;
  };
}

export const createRecipeStep = async (payload: CreateRecipeStepInput) => {
  const response = await api.fetch(`/v1/recipes/${payload.recipeId}/steps`, {
    method: "POST",
    body: JSON.stringify(payload.data)
  });
  return response.json() as Promise<RecipeStep>;
}

export const useRecipeStepCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecipeStep,
    onSuccess: (step) => {
      queryClient.setQueryData<RecipeStep[]>(
        getRecipeStepsQueryOptions(step.recipeId).queryKey,
        (old) => [...(old || []), step]
      );
    },
  });
};
