import { pgTable, index } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";

export const authRefreshTokens = pgTable(
	"auth_refresh_tokens",
	(t) => ({
		id: t.uuid().notNull().primaryKey(),
		userId: t
			.integer()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		createdAt: t.timestamp({ withTimezone: true }).notNull().defaultNow(),
		expiresAt: t.timestamp({ withTimezone: true }).notNull(),
	}),
	(table) => [
		index().on(table.userId),
		index().on(table.expiresAt),
		index().on(table.createdAt),
	],
).enableRLS();

export const authRefreshTokensRelations = relations(
	authRefreshTokens,
	({ one }) => ({
		user: one(users, {
			fields: [authRefreshTokens.userId],
			references: [users.id],
		}),
	}),
);

export type AuthRefreshTokenEntity = typeof authRefreshTokens.$inferSelect;
export type NewAuthRefreshTokenEntity = typeof authRefreshTokens.$inferInsert;
