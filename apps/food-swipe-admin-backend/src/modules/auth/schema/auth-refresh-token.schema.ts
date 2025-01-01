import { pgTable, uuid, timestamp, bigint } from 'drizzle-orm/pg-core';
import { usersSchema } from '../../user/schema/user.schema';

export const authRefreshTokenSchema = pgTable('auth_refresh_tokens', {
  id: uuid('id').notNull().primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).notNull().references(() => usersSchema.id),
  expiresAt: timestamp('expires_at').notNull()
});

export type AuthRefreshTokenEntity = typeof authRefreshTokenSchema.$inferSelect; // return type when queried
export type NewAuthRefreshTokenEntity = typeof authRefreshTokenSchema.$inferInsert; // insert type
