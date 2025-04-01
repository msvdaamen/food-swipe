import { create } from "zustand";

export interface Recipe {
  id: number;
  title: string;
  description: string;
  coverImageUrl?: string;
}

interface RecipeStore {
  recipes: Recipe[];
  isLoading: boolean;
  openCreateRecipeDialog: () => void;
  openImportDialog: () => void;
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  isLoading: false,
  openCreateRecipeDialog: () => {
    // TODO: Implement dialog opening logic
  },
  openImportDialog: () => {
    // TODO: Implement dialog opening logic
  },
}));
