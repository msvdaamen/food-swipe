import { drizzle } from 'drizzle-orm/bun-sql';
import { databaseConfig } from '../config/database.config.ts';

export type DatabaseProvider = ReturnType<typeof drizzle>;
export const databaseProvider = drizzle(databaseConfig.url);