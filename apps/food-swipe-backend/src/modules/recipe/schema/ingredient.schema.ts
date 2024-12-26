import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { measurements } from "./measurement.schema";


export const ingredients = pgTable('ingredients', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull()
});

export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;