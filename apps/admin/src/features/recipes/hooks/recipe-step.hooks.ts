import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recipeApi } from "../recipe.api";
import { ReorderRecipeStepsRequest } from "../requests/reorder-recipe-steps.request";
import { RecipeStep } from "../types/recipe-step.type";
import { arrayMove } from "@dnd-kit/sortable";
import { CreateRecipeStepRequest } from "../requests/create-recipe-step.request";
import { UpdateRecipeStepRequest } from "../requests/update-recipe-step.request";

type UseRecipeStepProps = {
  recipeId: number;
};

const keys = {
  all: (recipeId: number) => ["recipe", recipeId, "steps"],
};

export const useRecipeSteps = ({ recipeId }: UseRecipeStepProps) => {
  return useQuery({
    queryKey: keys.all(recipeId),
    queryFn: () => recipeApi.getSteps(Number(recipeId)),
  });
};

export const useRecipeStepsReorder = ({ recipeId }: UseRecipeStepProps) => {
  const key = keys.all(recipeId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderRecipeStepsRequest & { stepId: number }) =>
      recipeApi.reorderSteps(recipeId, payload.stepId, payload),
    onMutate: async (payload) => {
      const previousTodos = queryClient.getQueryData<RecipeStep[]>(key);
      queryClient.setQueryData<RecipeStep[]>(key, (old) => {
        if (!old) {
          return [];
        }
        const newSteps = arrayMove(
          old,
          payload.orderFrom - 1,
          payload.orderTo - 1
        );
        return newSteps;
      });
      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (!context) {
        return;
      }
      queryClient.setQueryData(key, context.previousTodos);
    },
  });
};

export const useRecipeStepCreate = ({ recipeId }: UseRecipeStepProps) => {
  const key = keys.all(recipeId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRecipeStepRequest) =>
      recipeApi.createStep(recipeId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(key, (old: RecipeStep[]) => [...old, data]);
    },
  });
};

export const useRecipeStepUpdate = ({
  recipeId,
  stepId,
}: UseRecipeStepProps & { stepId: number }) => {
  const key = keys.all(recipeId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRecipeStepRequest) =>
      recipeApi.updateStep(recipeId, stepId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(key, (old: RecipeStep[]) =>
        old.map((step) => (step.id === data.id ? data : step))
      );
    },
  });
};

export const useRecipeStepDelete = ({ recipeId }: UseRecipeStepProps) => {
  const key = keys.all(recipeId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stepId: number) => recipeApi.deleteStep(recipeId, stepId),
    onSuccess: (_, stepId) => {
      queryClient.setQueryData(key, (old: RecipeStep[]) =>
        old.filter((step) => step.id !== stepId)
      );
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
};
