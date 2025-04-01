import {
  Nutrition,
  NutritionUnit,
} from '@modules/recipes/constants/nutritions';

export type RecipeNutrition = {
  id: number;
  recipeId: number;
  name: Nutrition;
  unit: NutritionUnit;
  value: number;
};
