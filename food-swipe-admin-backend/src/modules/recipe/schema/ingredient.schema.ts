import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { measurementsSchema } from "./measurement.schema";


export const ingredientsSchema = pgTable('ingredients', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull()
});

export type IngredientEntity = typeof ingredientsSchema.$inferSelect;
export type NewIngredientEntity = typeof ingredientsSchema.$inferInsert;