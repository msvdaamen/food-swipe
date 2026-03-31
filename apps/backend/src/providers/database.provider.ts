import { drizzle } from "drizzle-orm/node-postgres";
import { AppContext } from "..";
import { Client } from "pg";
import { Result, TaggedError } from "better-result";

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

class TransactionError extends TaggedError("TransactionError")<{
  message: string;
  cause?: unknown;
}>() {}

type TransactionFn = Parameters<DatabaseProvider["transaction"]>[0];
export type TransactionInstance = Awaited<ReturnType<TransactionFn>>;

const runTransaction = async <T>(
  db: DatabaseProvider,
  operation: (db: TransactionInstance) => Promise<Result<T, Error>>
): Promise<Result<T, TransactionError>> => {
  return await Result.tryPromise({
    try: async () => {
      const result = await db.transaction(async (tx) => {
        const result = await operation(tx);
        if (Result.isError(result)) {
          throw result.error;
        }
        return result.value;
      });
      return result;
    },
    catch: (e) =>
      new TransactionError({
        message: "Transaction failed",
        cause: e
      })
  });
};
