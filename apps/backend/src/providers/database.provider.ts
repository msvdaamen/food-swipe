import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { databaseConfig } from "../config/database.config.ts";
import * as schema from "../schema";
import { instrumentDrizzleClient } from "@kubiks/otel-drizzle";

export type DatabaseProvider = ReturnType<typeof drizzle<typeof schema>>;

export const databaseProvider = drizzle(databaseConfig.url, {
  casing: "snake_case",
  schema,
});
instrumentDrizzleClient(databaseProvider);
export async function migrateDatabase() {
  await migrate(databaseProvider, {
    migrationsFolder: "./drizzle",
    migrationsSchema: "public",
  });
}
