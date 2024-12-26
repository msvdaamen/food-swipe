import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { recipes } from "./recipe.schema";


export const recipeStep = pgTable('recipe_steps', {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id),
    stepNumber: integer('step_number').notNull(),
    description: text('description').notNull(),
});

export type RecipeStep = typeof recipeStep.$inferSelect;
export type NewRecipeStep = typeof recipeStep.$inferInsert;