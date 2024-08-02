import {databaseConfig} from "../config/database.config";
import postgres from 'postgres';
import {drizzle} from 'drizzle-orm/postgres-js';
import {AsyncLocalStorage} from "node:async_hooks";

const queryClient = postgres(databaseConfig.url);

export type DatabaseProvider = ReturnType<typeof drizzle>;
export const databaseProvider = drizzle(queryClient);

export function getDatabase() {
    return dbTransactionStorage.getStore() ?? databaseProvider;
}

type TransactionFn = Parameters<DatabaseProvider['transaction']>;
type TransactionCallbackParam = Parameters<TransactionFn[0]>[0];
const dbTransactionStorage = new AsyncLocalStorage<TransactionCallbackParam>();

export async function transaction<T>(callback: (transaction: TransactionCallbackParam) => Promise<T>): Promise<T> {
    return await getDatabase().transaction(async transaction => {
        return await dbTransactionStorage.run(transaction, async () => {
            return await callback(transaction);
        });
    });
}