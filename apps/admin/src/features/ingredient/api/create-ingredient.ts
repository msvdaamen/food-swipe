import { api } from "@/lib/api";
import { Ingredient } from "../types/ingredient.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CreateIngredientInput = {
    data: {
        name: string;
    }
};

export const createIngredient = async (payload: CreateIngredientInput) => {
    const response = await api.fetch("/v1/ingredients", {
      body: JSON.stringify(payload.data),
      method: "POST"
    });
    return response.json() as Promise<Ingredient>;
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
