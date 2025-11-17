import {
  pgTable,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";

export const files = pgTable(
  "files",
  t => ({
    id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: t.integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    filename: t.text().notNull().unique(),
    type: t.text().notNull(),
    isPublic: t.boolean().default(false).notNull(),
    createdAt: t.timestamp({ withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t.timestamp({ withTimezone: true })
      .defaultNow()
      .notNull(),
  }),
  (table) => [index().on(table.isPublic), index().on(table.userId)]
).enableRLS();

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
}));

export type FileEntity = typeof files.$inferSelect;
export type NewFileEntity = typeof files.$inferInsert;
