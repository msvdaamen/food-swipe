import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ingredientApi } from "../ingredient.api";
import { GetIngredientsRequest } from "../requests/get-ingredients.request";
import { CreateIngredientRequest } from "../requests/create-ingredient.request";
import { UpdateIngredientRequest } from "../requests/update-ingredient.request";

export const useIngredients = (payload: GetIngredientsRequest) => {
  return useQuery({
    queryKey: ["ingredients", payload],
    queryFn: ({ signal }) => ingredientApi.getAll(payload, signal),
    placeholderData: keepPreviousData,
  });
};

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIngredientRequest) =>
      ingredientApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
};

export const useUpdateIngredient = (ingredientId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateIngredientRequest) =>
      ingredientApi.update(ingredientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
};

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ingredientApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });
};
