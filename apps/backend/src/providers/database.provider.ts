import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { databaseConfig } from "../config/database.config.ts";
import * as schema from "../schema";

export type DatabaseProvider = ReturnType<typeof drizzle<typeof schema>>;
export const databaseProvider = drizzle(databaseConfig.url, {
	casing: "snake_case",
	schema,
});

export async function migrateDatabase() {
	await migrate(databaseProvider, {
		migrationsFolder: "./drizzle",
		migrationsSchema: "public",
	});
}
