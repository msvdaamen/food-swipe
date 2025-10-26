import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { databaseConfig } from "../config/database.config.ts";

import * as schema from "@food-swipe/database";
import { resolve } from "path";

export type DatabaseProvider = ReturnType<typeof drizzle>;
export const databaseProvider = drizzle(databaseConfig.url, {
  casing: "snake_case",
  schema,
});

export async function migrateDatabase() {
  await migrate(databaseProvider, {
    migrationsFolder: resolve(
      __dirname,
      "../../../../packages/database/drizzle"
    ),
    migrationsSchema: "public",
  });
}
