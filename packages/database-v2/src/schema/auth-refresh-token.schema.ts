import { pgTable, uuid, timestamp, bigint, integer, index } from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { relations } from 'drizzle-orm';

export const authRefreshTokens = pgTable('auth_refresh_tokens', {
  id: uuid().notNull().primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
}, table => [
  index().on(table.userId),
  index().on(table.expiresAt)
]);

export const authRefreshTokensRelations = relations(authRefreshTokens, ({one}) => ({
  user: one(users, {
    fields: [authRefreshTokens.userId],
    references: [users.id]
  })
}));

export type AuthRefreshTokenEntity = typeof authRefreshTokens.$inferSelect;
export type NewAuthRefreshTokenEntity = typeof authRefreshTokens.$inferInsert;
