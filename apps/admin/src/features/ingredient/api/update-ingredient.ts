import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIngredient, type UpdateIngredientInput } from "@food-swipe/client-api/ingredient";
import { api } from "@/lib/api";

export { type UpdateIngredientInput };

export const useUpdateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateIngredientInput) => updateIngredient(api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    }
  });
};
