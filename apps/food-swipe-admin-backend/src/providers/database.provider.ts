import { drizzle } from 'drizzle-orm/bun-sql';
import { migrate } from 'drizzle-orm/bun-sql/migrator';

import { databaseConfig } from '../config/database.config.ts';

export type DatabaseProvider = ReturnType<typeof drizzle>;
export const databaseProvider = drizzle(databaseConfig.url, {casing: 'snake_case'});

export async function migrateDatabase() {
    await migrate(databaseProvider, {
        migrationsFolder: "../../packages/database-v2/drizzle",
    });
}
