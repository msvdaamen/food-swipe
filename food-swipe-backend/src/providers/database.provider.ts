import postgres from "postgres";
import {drizzle} from 'drizzle-orm/postgres-js';
import {databaseConfig} from "../config/database.config.ts";


const queryClient = postgres(databaseConfig.url);


export type DatabaseProvider = ReturnType<typeof drizzle>
export const databaseProvider: DatabaseProvider = drizzle(queryClient);