import postgres from "postgres";
import {drizzle} from 'drizzle-orm/postgres-js';
import {databaseConfig} from "../config/database.config.ts";


const connection = postgres(databaseConfig.url);


export type DatabaseProvider = ReturnType<typeof drizzle>;
export const databaseProvider = drizzle(connection);