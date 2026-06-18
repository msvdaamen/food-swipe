import type { Recipe, RecipeIngredient, RecipeNutrition, RecipeStep } from "@food-swipe/types";
import { queryOptions, useMutation, useQuery, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import {
  createRecipe,
  createRecipeIngredient,
  createRecipeStep,
  deleteRecipe,
  deleteRecipeIngredient,
  deleteRecipeStep,
  getRecipe,
  getRecipeIngredients,
  getRecipeNutrition,
  getRecipes,
  getRecipeSteps,
  importRecipe,
  recipeKeys,
  reorderRecipeSteps,
  updateRecipe,
  updateRecipeIngredient,
  updateRecipeNutrition,
  updateRecipeStep,
  type CreateRecipeInput,
  type CreateRecipeIngredientInput,
  type CreateRecipeStepInput,
  type DeleteRecipeIngredientInput,
  type DeleteRecipeStepInput,
  type GetRecipesInput,
  type RecipeListFilter,
  type ReorderRecipeStepsInput,
  type UpdateRecipeInput,
  type UpdateRecipeIngredientInput,
  type UpdateRecipeNutritionInput,
  type UpdateRecipeStepInput,
} from "@food-swipe/client-api/recipe";
import { useApiClient } from "@/lib/api-client-context";

export {
  recipeKeys,
  type CreateRecipeInput,
  type CreateRecipeIngredientInput,
  type CreateRecipeStepInput,
  type DeleteRecipeIngredientInput,
  type DeleteRecipeStepInput,
  type GetRecipesInput,
  type RecipeListFilter,
  type ReorderRecipeStepsInput,
  type UpdateRecipeInput,
  type UpdateRecipeIngredientInput,
  type UpdateRecipeNutritionInput,
  type UpdateRecipeStepInput,
};

export const getRecipesQueryOptions = (
  api: Parameters<typeof getRecipes>[0],
  payload: GetRecipesInput = {},
) =>
  queryOptions({
    queryKey: recipeKeys.list(payload),
    queryFn: () => getRecipes(api, payload),
  });

export const useRecipes = (payload?: GetRecipesInput) => {
  const api = useApiClient();
  return useQuery(getRecipesQueryOptions(api, payload));
};

export const getRecipeQueryOptions = (api: Parameters<typeof getRecipe>[0], recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.detail(recipeId),
    queryFn: () => getRecipe(api, recipeId),
  });

export const useRecipe = (
  { recipeId }: { recipeId: string },
  query?: Omit<ReturnType<typeof getRecipeQueryOptions>, "queryKey" | "queryFn">,
) => {
  const api = useApiClient();
  return useQuery({
    ...getRecipeQueryOptions(api, recipeId),
    ...query,
  });
};

export const useCreateRecipe = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecipeInput) => createRecipe(api, payload),
    onSuccess: (recipe) => {
      queryClient.setQueryData<Recipe[]>(getRecipesQueryOptions(api, {}).queryKey, (old) => [
        recipe,
        ...(old ?? []),
      ]);
    },
  });
};

type UseUpdateRecipeOptions = Omit<UseMutationOptions<Recipe, Error, UpdateRecipeInput>, "mutationFn">;

export const useUpdateRecipe = (config: UseUpdateRecipeOptions = {}) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config;

  return useMutation({
    mutationFn: (payload: UpdateRecipeInput) => updateRecipe(api, payload),
    ...restConfig,
    onSuccess: (...args) => {
      const [recipe] = args;
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      queryClient.setQueryData<Recipe>(getRecipeQueryOptions(api, recipe.id).queryKey, recipe);
      onSuccess?.(...args);
    },
  });
};

type UseDeleteRecipeOptions = Omit<UseMutationOptions<void, Error, string>, "mutationFn">;

export const useDeleteRecipe = (config: UseDeleteRecipeOptions = {}) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = config;

  return useMutation({
    mutationFn: (recipeId: string) => deleteRecipe(api, recipeId),
    ...restConfig,
    onSuccess: (...args) => {
      const [, recipeId] = args;
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      queryClient.setQueryData<Recipe[]>(getRecipesQueryOptions(api, {}).queryKey, (old) =>
        old?.filter((recipe) => recipe.id !== recipeId),
      );
      onSuccess?.(...args);
    },
  });
};

export const useRecipeImport = (onSuccess?: (data: { recipeId: string }) => void) => {
  const api = useApiClient();
  return useMutation({
    mutationFn: (url: string) => importRecipe(api, url),
    onSuccess: (data) => onSuccess?.(data),
  });
};

export const getRecipeIngredientsQueryOptions = (
  api: Parameters<typeof getRecipeIngredients>[0],
  recipeId: string,
) =>
  queryOptions({
    queryKey: recipeKeys.ingredients(recipeId),
    queryFn: () => getRecipeIngredients(api, recipeId),
  });

export const useRecipeIngredients = (recipeId: string) => {
  const api = useApiClient();
  return useQuery(getRecipeIngredientsQueryOptions(api, recipeId));
};

export const useRecipeIngredientCreate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRecipeIngredientInput) => createRecipeIngredient(api, payload),
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(api, ingredient.recipeId).queryKey,
        (old) => [...(old ?? []), ingredient],
      );
    },
  });
};

export const useRecipeIngredientUpdate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRecipeIngredientInput) => updateRecipeIngredient(api, payload),
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(api, ingredient.recipeId).queryKey,
        (old) => old?.map((i) => (i.ingredientId === ingredient.ingredientId ? ingredient : i)),
      );
    },
  });
};

export const useRecipeIngredientDelete = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteRecipeIngredientInput) => deleteRecipeIngredient(api, payload),
    onSuccess: (_, { recipeId, ingredientId }) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(api, recipeId).queryKey,
        (old) => old?.filter((i) => i.ingredientId !== ingredientId),
      );
    },
  });
};

export const getRecipeStepsQueryOptions = (api: Parameters<typeof getRecipeSteps>[0], recipeId: string) =>
  queryOptions({
    queryKey: recipeKeys.steps(recipeId),
    queryFn: () => getRecipeSteps(api, recipeId),
  });

export const useRecipeSteps = (recipeId: string) => {
  const api = useApiClient();
  return useQuery(getRecipeStepsQueryOptions(api, recipeId));
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

function arrayMove<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [removed] = next.splice(fromIndex, 1);
  if (removed === undefined) return next;
  next.splice(toIndex, 0, removed);
  return next;
}

export const useRecipeStepsReorder = (recipeId: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderRecipeStepsInput) => reorderRecipeSteps(api, payload),
    onMutate: async (payload) => {
      const key = getRecipeStepsQueryOptions(api, recipeId).queryKey;
      const previousSteps = queryClient.getQueryData<RecipeStep[]>(key);
      queryClient.setQueryData<RecipeStep[]>(key, (old) => {
        if (!old) return [];
        return arrayMove(old, payload.data.orderFrom - 1, payload.data.orderTo - 1);
      });
      return { previousSteps };
    },
    onError: (_, __, context) => {
      if (!context) return;
      const key = getRecipeStepsQueryOptions(api, recipeId).queryKey;
      queryClient.setQueryData(key, context.previousSteps);
    },
  });
};

export const getRecipeNutritionQueryOptions = (
  api: Parameters<typeof getRecipeNutrition>[0],
  recipeId: string,
) =>
  queryOptions({
    queryKey: recipeKeys.nutrition(recipeId),
    queryFn: () => getRecipeNutrition(api, recipeId),
  });

export const useRecipeNutrition = (recipeId: string) => {
  const api = useApiClient();
  return useQuery(getRecipeNutritionQueryOptions(api, recipeId));
};

export const useRecipeNutritionUpdate = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRecipeNutritionInput) => updateRecipeNutrition(api, payload),
    onSuccess: (nutrition) => {
      queryClient.setQueryData<RecipeNutrition[]>(
        getRecipeNutritionQueryOptions(api, nutrition.recipeId).queryKey,
        (old) => old?.map((n) => (n.name === nutrition.name ? nutrition : n)),
      );
    },
  });
};
