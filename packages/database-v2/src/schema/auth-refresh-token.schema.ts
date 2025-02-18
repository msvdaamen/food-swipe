import { pgTable, uuid, timestamp, bigint, integer, index } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const authRefreshTokens = pgTable('auth_refresh_tokens', {
  id: uuid().notNull().primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
}, table => [
  index().on(table.userId),
  index().on(table.expiresAt)
]);

export type AuthRefreshTokenEntity = typeof authRefreshTokens.$inferSelect;
export type NewAuthRefreshTokenEntity = typeof authRefreshTokens.$inferInsert;
