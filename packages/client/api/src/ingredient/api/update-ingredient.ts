import type { Ingredient } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { ingredientKeys } from "../keys";

export type UpdateIngredientInput = {
  data: {
    name?: string;
  };
  ingredientId: number;
};

export const updateIngredient = async (api: AuthApiClient, payload: UpdateIngredientInput) => {
  const response = await api.fetch(`/v1/ingredients/${payload.ingredientId}`, {
    method: "PUT",
    body: JSON.stringify(payload.data),
  });
  return response.json() as Promise<Ingredient>;
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
