import {
  RecipeEntity,
  RecipeIngredientEntity,
  RecipeNutritionEntity,
  RecipeStepEntity
} from "../../../schema";
import { Nutrition } from "@food-swipe/types";

export type RecipeIngredientModel = RecipeIngredientEntity & {
  ingredient: string;
  measurement: string | null;
};
export type RecipeNutritionModel = RecipeNutritionEntity;
export type RecipeStepModel = RecipeStepEntity;
export type RecipeModel = RecipeEntity & {
  nutrition: Partial<Record<Nutrition, RecipeNutritionEntity>>;
};
