import {
  pgTable,
} from "drizzle-orm/pg-core";
import { files } from "./file.schema";
import { authRefreshTokens } from "./auth-refresh-token.schema";
import { relations } from "drizzle-orm";

export const users = pgTable("users", t => ({
  id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: t.text("email").unique().notNull(),
  username: t.text("username").unique().notNull(),
  password: t.text("password").notNull(),
  firstName: t.text("first_name").notNull(),
  lastName: t.text("last_name").notNull(),
  isAdmin: t.boolean("is_admin").default(false).notNull(),
  createdAt: t.timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})).enableRLS();

export const usersRelations = relations(users, ({ many }) => ({
  files: many(files),
  authRefreshTokens: many(authRefreshTokens),
}));

export type UserEntity = typeof users.$inferSelect;
export type NewUserEntity = typeof users.$inferInsert;
