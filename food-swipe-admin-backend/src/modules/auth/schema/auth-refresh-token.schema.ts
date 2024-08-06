import { pgTable, uuid, timestamp, bigint } from 'drizzle-orm/pg-core';
import { users } from '../../user/schema/user.schema';

export const authRefreshTokens = pgTable('auth_refresh_tokens', {
  id: uuid('id').notNull().primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => users.id),
  expiresAt: timestamp('expires_at').notNull()
});

export type AuthRefreshToken = typeof authRefreshTokens.$inferSelect; // return type when queried
export type NewAuthRefreshToken = typeof authRefreshTokens.$inferInsert; // insert type
