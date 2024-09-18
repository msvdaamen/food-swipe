import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";
import {usersSchema} from "../../user/schema/user.schema.ts";
import {recipesSchema} from "./recipe.schema.ts";

export const userLikedRecipesSchema = pgTable('user_liked_recipe', {
    userId: integer('user_id').notNull(),
    recipeId: integer('recipe_id').notNull()
}, () => ({
    primaryKey: primaryKey({columns: [ usersSchema.id, recipesSchema.id ]})
}));

export type UserLikedRecipeEntity = typeof userLikedRecipesSchema.$inferSelect;
export type NewUserLikedRecipeEntity = typeof userLikedRecipesSchema.$inferInsert;