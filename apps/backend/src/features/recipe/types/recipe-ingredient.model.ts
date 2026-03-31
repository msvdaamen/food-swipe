import type { RecipeIngredientEntity } from "../../../schema";

export type RecipeIngredientModel = RecipeIngredientEntity & {
  ingredient: string;
  measurement: string | null;
};
