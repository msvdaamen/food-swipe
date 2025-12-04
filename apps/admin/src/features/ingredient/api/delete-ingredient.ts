import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteIngredientInput = {
    ingredientId: number;
}

export const deleteIngredient = async (payload: DeleteIngredientInput) => {
  const response = await api.fetch(`/v1/ingredients/${payload.ingredientId}`, {
    method: "DELETE"
  });
  return response.json();
}

export const useDeleteIngredient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteIngredient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}
