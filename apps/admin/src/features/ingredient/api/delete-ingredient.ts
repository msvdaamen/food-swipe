import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteIngredientInput = {
    ingredientId: number;
}

export const deleteIngredient = (payload: DeleteIngredientInput) => {
    return api.delete(`/v1/ingredients/${payload.ingredientId}`);
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