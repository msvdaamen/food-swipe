import {
  boolean,
  pgTable,
  integer,
  text,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { recipes } from "./recipe.schema";
import { files } from "./file.schema";
import { authRefreshTokens } from "./auth-refresh-token.schema";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  email: text().unique().notNull(),
  username: text().unique().notNull(),
  password: text().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}).enableRLS();

export const usersRelations = relations(users, ({ many }) => ({
  files: many(files),
  authRefreshTokens: many(authRefreshTokens),
}));

export type UserEntity = typeof users.$inferSelect;
export type NewUserEntity = typeof users.$inferInsert;
