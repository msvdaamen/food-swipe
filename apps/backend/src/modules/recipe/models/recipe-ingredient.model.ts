export type RecipeIngredientModel = {
	recipeId: number;
	ingredientId: number;
	ingredient: string;
	measurementId: number | null;
	measurement: string | null;
	amount: number;
};
