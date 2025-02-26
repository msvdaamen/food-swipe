import { pgTable, smallint, text } from "drizzle-orm/pg-core";

export const measurements = pgTable("measurements", {
  id: smallint().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  abbreviation: text().notNull(),
}).enableRLS();

export type MeasurementEntity = typeof measurements.$inferSelect;
export type newMeasurementEntity = typeof measurements.$inferInsert;
