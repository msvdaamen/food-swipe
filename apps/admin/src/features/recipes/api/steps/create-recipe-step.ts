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

export const createRecipeStep = (payload: CreateRecipeStepInput) => {
  return api.post<RecipeStep>(`/v1/recipes/${payload.recipeId}/steps`, payload.data);
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