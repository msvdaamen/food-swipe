import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { recipesSchema } from "./recipe.schema";


export const recipeStepSchema = pgTable('recipe_steps', {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id').notNull().references(() => recipesSchema.id),
    stepNumber: integer('step_number').notNull(),
    description: text('description').notNull(),
});

export type RecipeStepEntity = typeof recipeStepSchema.$inferSelect;
export type NewRecipeStepEntity = typeof recipeStepSchema.$inferInsert;