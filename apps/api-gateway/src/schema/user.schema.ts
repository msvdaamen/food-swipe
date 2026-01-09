import {
    index,
  pgTable,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { accounts, sessions } from "./auth.schema";

export const users = pgTable("users", t => ({
  id: t.uuid("id").primaryKey(),
  name: t.text("name").notNull(),
  email: t.text("email").notNull().unique(),
  emailVerified: t.boolean("email_verified").default(false).notNull(),
  image: t.text("image"),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: t.text("username").unique(),
  displayUsername: t.text("display_username"),
  role: t.text("role"),
  banned: t.boolean("banned").default(false),
  banReason: t.text("ban_reason"),
  banExpires: t.timestamp("ban_expires"),
}),
  t => ([
    index().on(t.createdAt)
  ])
).enableRLS();

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export type UserEntity = typeof users.$inferSelect;
export type NewUserEntity = typeof users.$inferInsert;
