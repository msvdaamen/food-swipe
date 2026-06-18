import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIngredient,
  deleteIngredient,
  getIngredients,
  ingredientKeys,
  updateIngredient,
  type CreateIngredientInput,
  type GetIngredientsInput,
  type UpdateIngredientInput,
} from "@food-swipe/client-api/ingredient";
import { useApiClient } from "@/lib/api-client-context";

export { ingredientKeys, type CreateIngredientInput, type GetIngredientsInput, type UpdateIngredientInput };

export const getIngredientsQueryOptions = (
  api: Parameters<typeof getIngredients>[0],
  payload: GetIngredientsInput,
) =>
  queryOptions({
    queryKey: ingredientKeys.list(payload),
    queryFn: () => getIngredients(api, payload),
    placeholderData: keepPreviousData,
  });

export const useIngredients = (payload: GetIngredientsInput) => {
  const api = useApiClient();
  return useQuery(getIngredientsQueryOptions(api, payload));
};

export const useCreateIngredient = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIngredientInput) => createIngredient(api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.all });
    },
  });
};

export const useUpdateIngredient = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateIngredientInput) => updateIngredient(api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.all });
    },
  });
};

export const useDeleteIngredient = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof deleteIngredient>[1]) => deleteIngredient(api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.all });
    },
  });
};
