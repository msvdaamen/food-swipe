import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIngredient, type CreateIngredientInput } from "@food-swipe/client-api/ingredient";
import { api } from "@/lib/api";

export { type CreateIngredientInput };

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateIngredientInput) => createIngredient(api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    }
  });
};
