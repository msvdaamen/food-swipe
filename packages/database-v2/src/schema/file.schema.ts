import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  varchar,
  boolean,
  integer,
  text,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";

export const files = pgTable(
  "files",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    filename: text().notNull().unique(),
    type: text().notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
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
