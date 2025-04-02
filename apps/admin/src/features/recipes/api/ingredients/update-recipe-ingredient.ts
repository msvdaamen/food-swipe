import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpApi } from "@/lib/api";
import { RecipeIngredient } from "../../types/recipe-ingredient.type";
import { getRecipeIngredientsQueryOptions } from "./get-recipe-ingredients";

export type UpdateRecipeIngredientInput = {
  recipeId: number;
  ingredientId: number;
  data: {
    amount?: number;
    measurementId?: number | null;
  };
};

export const updateRecipeIngredient = (
  payload: UpdateRecipeIngredientInput
) => {
  return httpApi.put<RecipeIngredient>(
    `/v1/recipes/${payload.recipeId}/ingredients/${payload.ingredientId}`,
    payload.data
  );
};

export const useRecipeIngredientUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRecipeIngredient,
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        getRecipeIngredientsQueryOptions(ingredient.recipeId).queryKey,
        (old) =>
          old?.map((i) =>
            i.ingredientId === ingredient.ingredientId ? ingredient : i
          )
      );
    },
  });
};
