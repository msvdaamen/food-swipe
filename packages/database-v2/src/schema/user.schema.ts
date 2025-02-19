import { boolean, pgTable, integer, text, timestamp, primaryKey, index } from "drizzle-orm/pg-core";
import { recipes } from "./recipe.schema";
import { files } from "./file.schema";
import { authRefreshTokens } from "./auth-refresh-token.schema";
import { relations } from "drizzle-orm";

export const users = pgTable('users', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    email: text().unique().notNull(),
    username: text().unique().notNull(),
    password: text().notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    isAdmin: boolean('is_admin').default(false).notNull(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull()
});

export const usersRelations = relations(users, ({many}) => ({
  likedRecipes: many(userLikedRecipes),
  files: many(files),
  authRefreshTokens: many(authRefreshTokens)
}));

export type UserEntity = typeof users.$inferSelect;
export type NewUserEntity = typeof users.$inferInsert;

export const userLikedRecipes = pgTable('user_liked_recipe', {
    userId: integer('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id, {onDelete: 'cascade'})
}, (table) => [
    primaryKey({columns: [ table.userId, table.recipeId ]}),
    index().on(table.recipeId),
    index().on(table.userId)
]);

export const userLikedRecipesRelations = relations(userLikedRecipes, ({one}) => ({
  user: one(users, {
    fields: [userLikedRecipes.userId],
    references: [users.id]
  }),
  recipe: one(recipes, {
    fields: [userLikedRecipes.recipeId],
    references: [recipes.id]
  })
}));

export type UserLikedRecipeEntity = typeof userLikedRecipes.$inferSelect;
export type NewUserLikedRecipeEntity = typeof userLikedRecipes.$inferInsert;