import type { Recipe } from "@food-swipe/types";

export type RecipeDto = Omit<Recipe, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export function mapRecipeDtoToModel(dto: RecipeDto): Recipe {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}
