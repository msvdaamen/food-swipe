import { drizzle } from "drizzle-orm/node-postgres";
import type { AppContext } from "../app-context";
import { Client } from "pg";

export type DatabaseProvider = Awaited<ReturnType<typeof createDatabase>>;

export async function createDatabase(connectionString: string) {
  const client = new Client({
    connectionString: connectionString
  });
  await client.connect();
  return drizzle({
    client,
    casing: "snake_case"
  });
}

export type DBContext = {
  Variables: {
    db: DatabaseProvider;
  };
} & AppContext;

type TransactionFn = Parameters<DatabaseProvider["transaction"]>[0];
export type TransactionInstance = Awaited<ReturnType<TransactionFn>>;
