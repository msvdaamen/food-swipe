import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { recipeApi } from "../recipe.api";
import { CreateRecipeIngredientRequest } from "../requests/create-recipe-ingredient.request";
import { UpdateRecipeIngredientRequest } from "../requests/update-recipe-ingredient.request";
import { RecipeIngredient } from "../types/recipe-ingredient.type";

const keys = {
  all: (recipeId: number) => ["recipes", recipeId, "ingredients"],
};

export const useRecipeIngredients = (recipeId: number) => {
  return useQuery({
    queryKey: keys.all(recipeId),
    queryFn: () => recipeApi.getIngredients(recipeId),
  });
};

export const useRecipeIngredientCreate = (recipeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredient: CreateRecipeIngredientRequest) =>
      recipeApi.createIngredient(recipeId, ingredient),
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(
        keys.all(recipeId),
        (old) => [...(old || []), ingredient]
      );
    },
  });
};

export const useRecipeIngredientUpdate = (recipeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredient: UpdateRecipeIngredientRequest & { id: number }) =>
      recipeApi.updateIngredient(recipeId, ingredient.id, ingredient),
    onSuccess: (ingredient) => {
      queryClient.setQueryData<RecipeIngredient[]>(keys.all(recipeId), (old) =>
        old?.map((i) =>
          i.ingredientId === ingredient.ingredientId ? ingredient : i
        )
      );
    },
  });
};
export const useRecipeIngredientDelete = (recipeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredientId: number) =>
      recipeApi.deleteIngredient(recipeId, ingredientId),
    onSuccess: (_, ingredientId) => {
      queryClient.setQueryData<RecipeIngredient[]>(keys.all(recipeId), (old) =>
        old?.filter((i) => i.ingredientId !== ingredientId)
      );
    },
  });
};
