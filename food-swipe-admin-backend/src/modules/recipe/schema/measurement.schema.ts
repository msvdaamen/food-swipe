import { pgTable, serial, varchar } from "drizzle-orm/pg-core";


export const measurementsSchema = pgTable('measurements', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    abbreviation: varchar('abbreviation').notNull(),
});

export type MeasurementEntity = typeof measurementsSchema.$inferSelect;
export type newMeasurementEntity = typeof measurementsSchema.$inferInsert;