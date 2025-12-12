import { create } from "zustand";

type State = {
  recipesStatus: Record<string, RecipeImportStatus>;
  addStatus: (recipeId: string, status: RecipeImportStatus) => void;
  updateStatus: (recipeId: string, status: RecipeImportStatus) => void;
  removeStatus: (recipeId: string) => void;
};

export const recipeImportStatusses = [
  "importing",
  "translating",
  "translated",
  "generating-image",
  "image-generated",
  "saving",
  "done"
] as const;

export type RecipeImportStatus = typeof recipeImportStatusses[number];

export const useImportingRecipeStore = create<State>()((set, get) => ({
  recipesStatus: {},
  addStatus: (recipeId: string, status: RecipeImportStatus) => set((state) => ({ recipesStatus: { ...state.recipesStatus, [recipeId]: status } })),
  updateStatus: (recipeId: string, status: RecipeImportStatus) => set((state) => ({ recipesStatus: { ...state.recipesStatus, [recipeId]: status } })),
  removeStatus: (recipeId: string) => {
    const statuses = { ...get().recipesStatus };
    delete statuses[recipeId];
    set({ recipesStatus: statuses });
  },
}));
