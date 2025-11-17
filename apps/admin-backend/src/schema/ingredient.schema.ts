import { index, pgTable } from "drizzle-orm/pg-core";

export const ingredients = pgTable(
  "ingredients",
  t => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: t.text().notNull(),
  }),
  (table) => [index().on(table.name)]
).enableRLS();

export type IngredientEntity = typeof ingredients.$inferSelect;
export type NewIngredientEntity = typeof ingredients.$inferInsert;
