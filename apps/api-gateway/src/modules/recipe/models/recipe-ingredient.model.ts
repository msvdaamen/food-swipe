export type RecipeIngredientModel = {
    recipeId: string;
    ingredientId: number;
    ingredient: string;
    measurementId: number | null;
    measurement: string | null;
    amount: number;
};
