

export type Recipe = {
    id: number;
    name: string;
    description: string;
    prepTime: number;
    servings: number;
    calories: number;
    coverImageUrl: string;
    createdAt: Date;
    updatedAt: Date;
};

export type FullRecipe = Recipe & {
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
};

export type RecipeIngredient = {
    id: number;
    name: string;
    measurement: string | null;
    abbreviation: string | null;
    amount: number;
}

export type RecipeStep = {
    id: number;
    description: string;
    recipeId: number;
    stepNumber: number;
};