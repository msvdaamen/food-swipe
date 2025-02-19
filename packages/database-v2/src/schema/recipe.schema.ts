import { pgTable, integer, timestamp, boolean, text, index, unique, primaryKey } from "drizzle-orm/pg-core";
import { files } from "./file.schema";
import { measurements } from "./measurement.schema";
import { ingredients } from "./ingredient.schema";
import { relations } from "drizzle-orm";

export const recipes = pgTable('recipes', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    title: text().notNull(),
    description: text(),
    prepTime: integer('prep_time'),
    servings: integer(),
    isPublished: boolean('is_published').notNull().default(false),
    coverImageId: integer('cover_image_id').references(() => files.id, {onDelete: 'set null'}),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull()
}, table => [
  index().on(table.isPublished),
  index().on(table.coverImageId)
]);

export const recipesRelations = relations(recipes, ({many, one}) => ({
  steps: many(recipeSteps),
  ingredients: many(recipeIngredients),
  nutritions: many(recipeNutritions),
  coverImage: one(files, {
    fields: [recipes.coverImageId],
    references: [files.id]
  })
}));

export type RecipeEntity = typeof recipes.$inferSelect;
export type NewRecipeEntity = typeof recipes.$inferInsert;

export const recipeSteps = pgTable('recipe_steps', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  recipeId: integer('recipe_id').notNull().references(() => recipes.id, {onDelete: 'cascade'}),
  stepNumber: integer('step_number').notNull(),
  description: text().notNull(),
}, table => [
  index().on(table.recipeId)
]);

export const recipeStepsRelations = relations(recipeSteps, ({one}) => ({
  recipe: one(recipes, {
    fields: [recipeSteps.recipeId],
    references: [recipes.id]
  })
}));

export type RecipeStepEntity = typeof recipeSteps.$inferSelect;
export type NewRecipeStepEntity = typeof recipeSteps.$inferInsert;

export const recipeIngredients = pgTable('recipe_ingredients', {
  recipeId: integer('recipe_id').notNull().references(() => recipes.id, {onDelete: 'cascade'}),
  ingredientId: integer('ingredient_id').notNull().references(() => ingredients.id, {onDelete: 'restrict'}),
  measurementId: integer('measurement_id').references(() => measurements.id, {onDelete: 'restrict'}),
  amount: integer().notNull()
}, table => [
  primaryKey({columns: [table.recipeId, table.ingredientId]}),
  index().on(table.recipeId),
  index().on(table.ingredientId),
  index().on(table.measurementId)
]);

export const recipeIngredientsRelations = relations(recipeIngredients, ({one}) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id]
  }),
  ingredient: one(ingredients, {
    fields: [recipeIngredients.ingredientId],
    references: [ingredients.id]
  }),
  measurement: one(measurements, {
    fields: [recipeIngredients.measurementId],
    references: [measurements.id]
  })
}));

export type RecipeIngredientEntity = typeof recipeIngredients.$inferSelect;
export type NewRecipeIngredientEntity = typeof recipeIngredients.$inferInsert;


export const recipeNutritions = pgTable('recipe_nutritions', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  recipeId: integer('recipe_id').notNull().references(() => recipes.id, {onDelete: 'cascade'}),
  name: text().notNull(),
  unit: text().notNull(),
  value: integer().notNull(),
}, table => [
  unique().on(table.recipeId, table.name),
  index().on(table.recipeId)
]);

export const recipeNutritionsRelations = relations(recipeNutritions, ({one}) => ({
  recipe: one(recipes, {
    fields: [recipeNutritions.recipeId],
    references: [recipes.id]
  })
}));

export type RecipeNutritionEntity = typeof recipeNutritions.$inferSelect;
export type NewRecipeNutritionEntity = typeof recipeNutritions.$inferInsert;