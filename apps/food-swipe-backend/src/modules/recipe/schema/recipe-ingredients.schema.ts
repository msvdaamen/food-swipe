import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { recipes } from "./recipe.schema";
import { ingredients } from "./ingredient.schema";
import { measurements } from "./measurement.schema";



export const recipeIngredients = pgTable('recipe_ingredients', {
    recipeId: integer('recipe_id').notNull().references(() => recipes.id),
    ingredientId: integer('ingredient_id').notNull().references(() => ingredients.id),
    measurementId: integer('measurement_id').notNull().references(() => measurements.id),
    amount: integer('amount').notNull()
}, () => ({
    primaryKey: primaryKey({columns: [recipes.id, ingredients.id]})
}));