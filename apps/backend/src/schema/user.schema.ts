import { pgTable } from "drizzle-orm/pg-core";
import { files } from "./file.schema";
import { authRefreshTokens } from "./auth-refresh-token.schema";
import { relations } from "drizzle-orm";

export const users = pgTable("users", (t) => ({
	id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
	email: t.text().unique().notNull(),
	username: t.text().unique().notNull(),
	password: t.text().notNull(),
	firstName: t.text().notNull(),
	lastName: t.text().notNull(),
	isAdmin: t.boolean().default(false).notNull(),
	createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
})).enableRLS();

export const usersRelations = relations(users, ({ many }) => ({
	files: many(files),
	authRefreshTokens: many(authRefreshTokens),
}));

export type UserEntity = typeof users.$inferSelect;
export type NewUserEntity = typeof users.$inferInsert;
