import { pgTable, index, uniqueIndex } from "drizzle-orm/pg-core";
import { eq, sql } from "drizzle-orm";
import { users } from "./user.schema";

export const recipeBooks = pgTable(
  "recipe_books",
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: t
      .uuid()
      .notNull()
      .references(() => users.id),
    coverImage: t.text(),
    title: t.text().notNull(),
    isLiked: t.boolean().notNull().default(false),
    createdAt: t.timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: t.timestamp({ withTimezone: true }).notNull().defaultNow()
  }),
  (t) => [
    index().on(t.userId),
    uniqueIndex("recipe_books_user_id_is_liked_index")
      .on(t.userId)
      .where(eq(t.isLiked, sql`TRUE`))
  ]
);

export type RecipeBookEntity = typeof recipeBooks.$inferSelect;
export type NewRecipeBookEntity = typeof recipeBooks.$inferInsert;
