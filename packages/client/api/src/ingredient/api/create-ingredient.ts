import type { Ingredient } from "@food-swipe/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { ingredientKeys } from "../keys";

export type CreateIngredientInput = {
  data: {
    name: string;
  };
};

export const createIngredient = async (api: AuthApiClient, payload: CreateIngredientInput) => {
  const response = await api.fetch("/v1/ingredients", {
    body: JSON.stringify(payload.data),
    method: "POST",
  });
  return response.json() as Promise<Ingredient>;
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
