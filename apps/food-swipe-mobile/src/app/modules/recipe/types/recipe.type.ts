import { Nutrition, NutritionUnit } from '../constants/nutritions';

export type Recipe = {
  id: number;
  title: string;
  description: string;
  prepTime: number;
  servings: number;
  coverImageUrl: string;
  liked: boolean;
  createdAt: Date;
  updatedAt: Date;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutritions: {
    [name in Nutrition]?: {
      name: Nutrition;
      unit: NutritionUnit;
      value: number;
    };
  };
};

export type RecipeIngredient = {
  id: number;
  name: string;
  measurement: string | null;
  abbreviation: string | null;
  amount: number;
};

export type RecipeStep = {
  id: number;
  description: string;
  recipeId: number;
  stepNumber: number;
};
