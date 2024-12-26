import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', {length: 255}).unique().notNull(),
    username: varchar('username', {length: 255}).unique().notNull(),
    password: varchar('password', {length: 255}).unique().notNull(),
    firstName: varchar('first_name', {length: 255}).unique().notNull(),
    lastName: varchar('last_name', {length: 255}).unique().notNull(),
    isAdmin: boolean('is_admin').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type