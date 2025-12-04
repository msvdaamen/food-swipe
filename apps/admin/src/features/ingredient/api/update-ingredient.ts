import { api } from "@/lib/api";
import { Ingredient } from "../types/ingredient.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type UpdateIngredientInput = {
    data: {
        name?: string;
    }
    ingredientId: number;
};


export const updateIngredient = async (payload: UpdateIngredientInput) => {
    const response = await api.fetch(`/v1/ingredients/${payload.ingredientId}`, {
      method: 'PUT',
      body: JSON.stringify(payload.data),
    });
    return response.json() as Promise<Ingredient>;
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
