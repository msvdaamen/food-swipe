import {
  Nutrition,
  NutritionUnit,
} from "@/features/recipes/constants/nutritions";

export type RecipeNutrition = {
  id: number;
  recipeId: string;
  name: Nutrition;
  unit: NutritionUnit;
  value: number;
};
