import { drizzle } from 'drizzle-orm/bun-sql';
import { migrate } from 'drizzle-orm/bun-sql/migrator';
import { databaseConfig } from '../config/database.config.ts';

import * as schema from "@food-swipe/database";
import { resolve } from 'path';

export type DatabaseProvider = ReturnType<typeof drizzle>;
export const databaseProvider = drizzle(databaseConfig.url, {casing: 'snake_case', schema});

export async function migrateDatabase() {
    console.log(resolve(__dirname, '../../packages/database-v2/drizzle'));
    await migrate(databaseProvider, {
        migrationsFolder: "../../packages/database-v2/drizzle"
    });
}
