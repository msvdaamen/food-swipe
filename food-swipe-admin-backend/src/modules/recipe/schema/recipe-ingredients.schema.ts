import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { recipesSchema } from "./recipe.schema";
import { ingredientsSchema } from "./ingredient.schema";
import { measurementsSchema } from "../../measurement/schema/measurement.schema.ts";



export const recipeIngredientsSchema = pgTable('recipe_ingredients', {
    recipeId: integer('recipe_id').notNull().references(() => recipesSchema.id),
    ingredientId: integer('ingredient_id').notNull().references(() => ingredientsSchema.id),
    measurementId: integer('measurement_id').notNull().references(() => measurementsSchema.id),
    amount: integer('amount').notNull()
}, () => ({
    primaryKey: primaryKey({columns: [recipesSchema.id, ingredientsSchema.id]})
}));