import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIngredient } from "@food-swipe/client-api/ingredient";
import { api } from "@/lib/api";

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof deleteIngredient>[1]) => deleteIngredient(api, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    }
  });
};
