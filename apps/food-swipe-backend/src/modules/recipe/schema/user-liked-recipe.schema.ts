import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";
import {users} from "../../user/schema/user.schema.ts";
import {recipes} from "./recipe.schema.ts";

export const userLikedRecipes = pgTable('user_liked_recipe', {
    userId: integer('user_id').notNull(),
    recipeId: integer('recipe_id').notNull()
}, () => ({
    primaryKey: primaryKey({columns: [ users.id, recipes.id ]})
}));


export type UserLikedRecipe = typeof userLikedRecipes.$inferSelect;
export type NewUserLikedRecipe = typeof userLikedRecipes.$inferInsert;