import { drizzle } from 'drizzle-orm/bun-sql';
import { migrate } from 'drizzle-orm/bun-sql/migrator';
import {databaseConfig} from "../config/database.config.ts";

import * as schema from "@food-swipe/database";

export type DatabaseProvider = ReturnType<typeof drizzle>
export const databaseProvider = drizzle(databaseConfig.url, {casing: 'snake_case', schema});

export async function migrateDatabase() {
    await migrate(databaseProvider, {
        migrationsFolder: "../../packages/database-v2/drizzle"
    });
}