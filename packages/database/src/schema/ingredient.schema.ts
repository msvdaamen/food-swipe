import { index, integer, pgTable, text } from "drizzle-orm/pg-core";

export const ingredients = pgTable(
  "ingredients",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: text().notNull(),
  },
  (table) => [index().on(table.name)]
).enableRLS();

export type IngredientEntity = typeof ingredients.$inferSelect;
export type NewIngredientEntity = typeof ingredients.$inferInsert;
