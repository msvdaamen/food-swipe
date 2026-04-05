import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthApiClient } from "../../client";
import { useApiClient } from "../../context";
import { ingredientKeys } from "../keys";

type DeleteIngredientInput = {
  ingredientId: number;
};

export const deleteIngredient = async (api: AuthApiClient, payload: DeleteIngredientInput) => {
  const response = await api.fetch(`/v1/ingredients/${payload.ingredientId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const useDeleteIngredient = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteIngredientInput) => deleteIngredient(api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.all });
    },
  });
};
