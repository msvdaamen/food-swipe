import { pgTable, index, uniqueIndex } from "drizzle-orm/pg-core";
import { files } from "./file.schema";
import { eq, relations, sql } from "drizzle-orm";
import { users } from "./user.schema";
import { recipesToRecipeBooks } from "./recipe.schema";

export const recipeBooks = pgTable(
	"recipe_books",
	(t) => ({
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
		userId: t
			.integer()
			.notNull()
			.references(() => users.id),
		imageId: t.integer().references(() => files.id),
		title: t.text().notNull(),
		isLiked: t.boolean().notNull().default(false),
		createdAt: t.timestamp({ withTimezone: true }).notNull().defaultNow(),
		updatedAt: t.timestamp({ withTimezone: true }).notNull().defaultNow(),
	}),
	(t) => [
		index().on(t.userId),
		index().on(t.imageId),
		uniqueIndex("recipe_books_user_id_is_liked_index")
			.on(t.userId)
			.where(eq(t.isLiked, sql`TRUE`)),
	],
);

export type RecipeBookEntity = typeof recipeBooks.$inferSelect;
export type NewRecipeBookEntity = typeof recipeBooks.$inferInsert;

export const recipeBookRelations = relations(recipeBooks, ({ one, many }) => ({
	user: one(users, {
		fields: [recipeBooks.userId],
		references: [users.id],
	}),
	image: one(files, {
		fields: [recipeBooks.imageId],
		references: [files.id],
	}),
	recipeToRecipeBooks: many(recipesToRecipeBooks),
}));
