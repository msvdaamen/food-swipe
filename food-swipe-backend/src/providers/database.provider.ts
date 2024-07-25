import postgres from "postgres";
import { drizzle } from 'drizzle-orm/postgres-js';


const queryClient = postgres({
    host: 'localhost',
    port: 5432,
    database: 'food-swipe',
    username: 'postgres',
    password: 'example'
});


export type DatabaseProvider = ReturnType<typeof drizzle>;
export const databaseProvider = drizzle(queryClient);