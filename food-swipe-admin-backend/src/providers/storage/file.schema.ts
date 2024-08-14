import { bigint, bigserial, pgTable, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';

export const files = pgTable('files', {
  id: bigserial('id', { mode: 'number' }).notNull().primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export type FileEntity = typeof files.$inferSelect;
export type NewFileObj = typeof files.$inferInsert;
