import { api } from "@/lib/api";
import { Ingredient } from "../types/ingredient.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CreateIngredientInput = {
    data: {
        name: string;
    }
};

export const createIngredient = (payload: CreateIngredientInput) => {
    return api.post<Ingredient>("/v1/ingredients", payload.data);
}

export const useCreateIngredient = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createIngredient,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      },
    });
  };