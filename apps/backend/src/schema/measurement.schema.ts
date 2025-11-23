import { pgTable } from "drizzle-orm/pg-core";

export const measurements = pgTable("measurements", t => ({
  id: t.smallint().primaryKey().generatedByDefaultAsIdentity(),
  name: t.text().notNull(),
  abbreviation: t.text().notNull(),
})
).enableRLS();

export type MeasurementEntity = typeof measurements.$inferSelect;
export type newMeasurementEntity = typeof measurements.$inferInsert;
