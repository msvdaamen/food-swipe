import { pgTable, serial, varchar, integer, timestamp, boolean, bigint } from "drizzle-orm/pg-core";
import { files } from "../../../providers/storage/file.schema";

export const recipes = pgTable('recipes', {
    id: serial('id').primaryKey(),
    title: varchar('title').notNull(),
    description: varchar('description'),
    prepTime: integer('prep_time'),
    servings: integer('servings'),
    isPublished: boolean('is_published').notNull().default(false),
    coverImageId: bigint('cover_image_id', {mode: 'number'}).references(() => files.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;