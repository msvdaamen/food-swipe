import { index, camelCase } from "drizzle-orm/pg-core";

export const ingredients = camelCase.table(
  "ingredients",
  (t) => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: t.text().notNull()
  }),
  (table) => [index().on(table.name)]
);

export type IngredientEntity = typeof ingredients.$inferSelect;
export type NewIngredientEntity = typeof ingredients.$inferInsert;
