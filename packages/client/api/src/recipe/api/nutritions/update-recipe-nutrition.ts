import type { Nutrition, NutritionUnit, RecipeNutrition } from "@food-swipe/types";
import type { HttpClient } from "../../../client";

export type UpdateRecipeNutritionInput = {
  recipeId: string;
  name: Nutrition;
  data: {
    unit: NutritionUnit;
    value: number;
  };
};

export const updateRecipeNutrition = async (
  api: HttpClient,
  payload: UpdateRecipeNutritionInput,
) => {
  const response = await api.fetch(
    `/v1/recipes/${payload.recipeId}/nutritions/${payload.name}`,
    {
      method: "PUT",
      body: JSON.stringify(payload.data),
    },
  );
  return response.json() as Promise<RecipeNutrition>;
};
