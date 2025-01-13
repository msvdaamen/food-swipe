import { NutritionUnit } from '@modules/recipes/constants/nutritions';

export type UpdateRecipeNutritionRequest = {
  unit: NutritionUnit;
  value: number;
};
