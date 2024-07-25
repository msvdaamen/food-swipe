import { pgTable, serial, varchar } from "drizzle-orm/pg-core";


export const measurements = pgTable('measurements', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    abbreviation: varchar('abbreviation').notNull(),
});

export type Measurement = typeof measurements.$inferSelect;
export type newMeasurement = typeof measurements.$inferInsert;