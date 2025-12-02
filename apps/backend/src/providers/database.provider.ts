import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
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
