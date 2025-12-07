import { Nutrition, NutritionUnit } from "../constants/nutritions";

export type RecipeNutrition = {
  id: number;
  recipeId: number;
  name: Nutrition;
  unit: NutritionUnit;
  value: number;
};
