import { pgTable, index, unique, primaryKey } from "drizzle-orm/pg-core";
import { files } from "./file.schema";
import { measurements } from "./measurement.schema";
import { ingredients } from "./ingredient.schema";
import { relations } from "drizzle-orm";
import { recipeBooks } from "./recipe-book.schema";

export const recipes = pgTable(
	"recipes",
	(t) => ({
		id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
		title: t.text().notNull(),
		description: t.text(),
		prepTime: t.integer(),
		servings: t.integer(),
		isPublished: t.boolean().notNull().default(false),
		coverImageId: t.integer().references(() => files.id, {
			onDelete: "set null",
		}),
		createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
	}),
	(table) => [index().on(table.isPublished), index().on(table.coverImageId)],
).enableRLS();

export const recipesRelations = relations(recipes, ({ many, one }) => ({
	steps: many(recipeSteps),
	ingredients: many(recipeIngredients),
	nutritions: many(recipeNutritions),
	coverImage: one(files, {
		fields: [recipes.coverImageId],
		references: [files.id],
	}),
	recipeToRecipeBooks: many(recipesToRecipeBooks),
}));

export type RecipeEntity = typeof recipes.$inferSelect;
export type NewRecipeEntity = typeof recipes.$inferInsert;

export const recipeSteps = pgTable(
	"recipe_steps",
	(t) => ({
		id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
		recipeId: t
			.integer()
			.notNull()
			.references(() => recipes.id, { onDelete: "cascade" }),
		stepNumber: t.integer().notNull(),
		description: t.text().notNull(),
	}),
	(table) => [index().on(table.recipeId)],
).enableRLS();

export const recipeStepsRelations = relations(recipeSteps, ({ one }) => ({
	recipe: one(recipes, {
		fields: [recipeSteps.recipeId],
		references: [recipes.id],
	}),
}));

export type RecipeStepEntity = typeof recipeSteps.$inferSelect;
export type NewRecipeStepEntity = typeof recipeSteps.$inferInsert;

export const recipeIngredients = pgTable(
	"recipe_ingredients",
	(t) => ({
		recipeId: t
			.integer()
			.notNull()
			.references(() => recipes.id, { onDelete: "cascade" }),
		ingredientId: t
			.integer()
			.notNull()
			.references(() => ingredients.id, { onDelete: "restrict" }),
		measurementId: t.integer().references(() => measurements.id, {
			onDelete: "restrict",
		}),
		amount: t.integer().notNull(),
	}),
	(table) => [
		primaryKey({ columns: [table.recipeId, table.ingredientId] }),
		index().on(table.recipeId),
		index().on(table.ingredientId),
		index().on(table.measurementId),
	],
).enableRLS();

export const recipeIngredientsRelations = relations(
	recipeIngredients,
	({ one }) => ({
		recipe: one(recipes, {
			fields: [recipeIngredients.recipeId],
			references: [recipes.id],
		}),
		ingredient: one(ingredients, {
			fields: [recipeIngredients.ingredientId],
			references: [ingredients.id],
		}),
		measurement: one(measurements, {
			fields: [recipeIngredients.measurementId],
			references: [measurements.id],
		}),
	}),
);

export type RecipeIngredientEntity = typeof recipeIngredients.$inferSelect;
export type NewRecipeIngredientEntity = typeof recipeIngredients.$inferInsert;

export const recipeNutritions = pgTable(
	"recipe_nutritions",
	(t) => ({
		id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
		recipeId: t
			.integer()
			.notNull()
			.references(() => recipes.id, { onDelete: "cascade" }),
		name: t.text().notNull(),
		unit: t.text().notNull(),
		value: t.integer().notNull(),
	}),
	(table) => [
		unique().on(table.recipeId, table.name),
		index().on(table.recipeId),
	],
).enableRLS();

export const recipeNutritionsRelations = relations(
	recipeNutritions,
	({ one }) => ({
		recipe: one(recipes, {
			fields: [recipeNutritions.recipeId],
			references: [recipes.id],
		}),
	}),
);

export type RecipeNutritionEntity = typeof recipeNutritions.$inferSelect;
export type NewRecipeNutritionEntity = typeof recipeNutritions.$inferInsert;

export const recipesToRecipeBooks = pgTable(
	"recipes_to_recipe_books",
	(t) => ({
		recipeBookId: t
			.integer()
			.notNull()
			.references(() => recipeBooks.id),
		recipeId: t
			.integer()
			.notNull()
			.references(() => recipes.id),
	}),
	(t) => [
		index().on(t.recipeBookId),
		index().on(t.recipeId),
		primaryKey({ columns: [t.recipeBookId, t.recipeId] }),
	],
);

export const recipeToRecipeBooksRelations = relations(
	recipesToRecipeBooks,
	({ one }) => ({
		recipeBook: one(recipeBooks, {
			fields: [recipesToRecipeBooks.recipeBookId],
			references: [recipeBooks.id],
		}),
		recipe: one(recipes, {
			fields: [recipesToRecipeBooks.recipeId],
			references: [recipes.id],
		}),
	}),
);
