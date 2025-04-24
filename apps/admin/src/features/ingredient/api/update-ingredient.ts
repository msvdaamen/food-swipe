import { api } from "@/lib/api";
import { Ingredient } from "../types/ingredient.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpdateIngredientInput = {
    data: {
        name?: string;
    }
    ingredientId: number;
};
  

export const updateIngredient = (payload: UpdateIngredientInput) => {
    return api.put<Ingredient>(`/v1/ingredients/${payload.ingredientId}`, payload.data);
}

export const useUpdateIngredient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateIngredient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });
}