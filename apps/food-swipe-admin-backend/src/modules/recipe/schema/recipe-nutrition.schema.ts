import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import {recipesSchema} from "./recipe.schema.ts";


export const recipeNutritionsSchema = pgTable('recipe_nutritions', {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id').notNull().references(() => recipesSchema.id),
    name: text('name').notNull(),
    unit: text('unit').notNull(),
    value: integer('value').notNull(),
});

export type RecipeNutritionEntity = typeof recipeNutritionsSchema.$inferSelect;
export type NewRecipeNutritionEntity = typeof recipeNutritionsSchema.$inferInsert;