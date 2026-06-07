import { camelCase } from "drizzle-orm/pg-core";

export const measurements = camelCase.table("measurements", (t) => ({
  id: t.smallint().primaryKey().generatedByDefaultAsIdentity(),
  name: t.text().notNull(),
  abbreviation: t.text().notNull()
}));

export type MeasurementEntity = typeof measurements.$inferSelect;
export type newMeasurementEntity = typeof measurements.$inferInsert;
